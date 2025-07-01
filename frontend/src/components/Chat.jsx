/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_URL =
  import.meta.env.VITE_API_URL || "https://llm-chat-backend-51h7.onrender.com";

const Chat = ({ onLogout }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/login");
      return;
    }

    // Set user info
    setUser(userInfo);

    // Set authorization header
    axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(savedTheme === "true");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
      localStorage.setItem("darkMode", prefersDark.toString());
    }

    // Fetch chat history
    fetchChatHistory();
  }, [navigate]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Save theme preference
    localStorage.setItem("darkMode", darkMode.toString());
    // Apply theme to body
    document.body.classList.toggle("dark-theme", darkMode);
  }, [darkMode]);

  const fetchChatHistory = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const response = await axios.get(`${API_URL}/api/chat/history`);
      if (response.data.chatHistory && response.data.chatHistory.length > 0) {
        setMessages(
          response.data.chatHistory.map((msg) => ({
            role: msg.role,
            content: msg.content,
          }))
        );
      } else {
        // Add welcome message if no history
        setMessages([
          {
            role: "model",
            content: `Hello ${
              user?.name || "there"
            }! How can I assist you today?`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      setApiError("Failed to load chat history. Please try again later.");
      // Handle unauthorized error
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
        navigate("/login", {
          state: { message: "Session expired. Please log in again." },
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message to the chat
    const userMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input and set loading state
    const message = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Send request to backend
      const response = await axios.post(`${API_URL}/api/chat`, {
        msg: message,
      });

      // Add AI response to the chat
      const aiMessage = {
        role: "model",
        content: response.data.reply || "Sorry, I couldn't process that.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle unauthorized error
      if (error.response?.status === 401) {
        localStorage.removeItem("userInfo");
        navigate("/login", {
          state: { message: "Session expired. Please log in again." },
        });
      } else {
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            content: "Sorry, an error occurred. Please try again later.",
          },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("userInfo");
    // Remove authorization header
    delete axios.defaults.headers.common["Authorization"];
    // Call the onLogout prop if provided
    if (onLogout) {
      onLogout();
    }
    // Navigate to login page
    navigate("/login");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const clearChat = async () => {
    try {
      await axios.delete(`${API_URL}/api/chat/history`);
      setMessages([
        {
          role: "model",
          content: "Chat history cleared. How can I assist you today?",
        },
      ]);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen transition-colors duration-300 ${
        darkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" 
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      }`}
    >
      {/* Header */}
      <header
        className={`backdrop-blur-xl border-b transition-all duration-300 ${
          darkMode
            ? "bg-gray-900/80 border-gray-700/50 shadow-xl shadow-purple-500/10"
            : "bg-white/80 border-gray-200/50 shadow-xl shadow-blue-500/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                darkMode 
                  ? "bg-gradient-to-br from-purple-500 to-indigo-600" 
                  : "bg-gradient-to-br from-blue-500 to-purple-600"
              }`}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-lg sm:text-xl lg:text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}>
                  AI Assistant
                </h1>
                <p className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } hidden sm:block`}>
                  Powered by AI
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      user?.name || "User"
                    }&background=random&color=fff&size=128`
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                />
                <div className="hidden lg:block">
                  <p className={`text-sm font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {user?.name || "User"}
                  </p>
                  <p className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Online
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearChat}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Clear Chat
                </button>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    darkMode
                      ? "bg-red-900/50 hover:bg-red-800/50 text-red-300"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-xl transition-colors ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`md:hidden border-t py-4 space-y-3 ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}>
              <div className="flex items-center space-x-3 px-2">
                <img
                  src={
                    user?.avatar ||
                    `https://ui-avatars.com/api/?name=${
                      user?.name || "User"
                    }&background=random&color=fff&size=128`
                  }
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-white shadow-lg"
                />
                <div>
                  <p className={`text-sm font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}>
                    {user?.name || "User"}
                  </p>
                  <p className={`text-xs ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}>
                    Online
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <button
                  onClick={toggleTheme}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  {darkMode ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                  <span className="text-sm">
                    {darkMode ? "Light Mode" : "Dark Mode"}
                  </span>
                </button>
              </div>

              <div className="flex flex-col space-y-2 px-2">
                <button
                  onClick={clearChat}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear Chat</span>
                </button>
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    darkMode
                      ? "bg-red-900/50 hover:bg-red-800/50 text-red-300"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col p-4 sm:p-6">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {apiError && (
              <div className={`p-4 rounded-xl border ${
                darkMode
                  ? "bg-red-900/20 border-red-800 text-red-300"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}>
                <p className="text-sm">{apiError}</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } animate-fadeIn`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-lg transition-all duration-200 hover:shadow-xl ${
                    message.role === "user"
                      ? darkMode
                        ? "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-br-md"
                        : "bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-br-md"
                      : darkMode
                      ? "bg-gray-800/80 backdrop-blur-sm text-gray-100 rounded-bl-md border border-gray-700/50"
                      : "bg-white/80 backdrop-blur-sm text-gray-800 rounded-bl-md border border-gray-200/50"
                  }`}
                >
                  {message.role === "model" ? (
                    <div className="prose prose-sm sm:prose max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        className={`markdown-content ${
                          darkMode ? "prose-invert" : ""
                        }`}
                        components={{
                          code: ({ node, inline, className, children, ...props }) => {
                            return inline ? (
                              <code
                                className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                                  darkMode
                                    ? "bg-gray-700 text-purple-300"
                                    : "bg-gray-100 text-purple-600"
                                }`}
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <pre
                                className={`p-3 rounded-lg overflow-x-auto text-sm ${
                                  darkMode
                                    ? "bg-gray-900 text-gray-100"
                                    : "bg-gray-50 text-gray-800"
                                }`}
                              >
                                <code {...props}>{children}</code>
                              </pre>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div
                  className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] rounded-2xl px-4 py-3 sm:px-6 sm:py-4 rounded-bl-md ${
                    darkMode
                      ? "bg-gray-800/80 backdrop-blur-sm border border-gray-700/50"
                      : "bg-white/80 backdrop-blur-sm border border-gray-200/50"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        darkMode ? "bg-purple-400" : "bg-blue-500"
                      }`} style={{ animationDelay: "0ms" }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        darkMode ? "bg-purple-400" : "bg-blue-500"
                      }`} style={{ animationDelay: "150ms" }}></div>
                      <div className={`w-2 h-2 rounded-full animate-bounce ${
                        darkMode ? "bg-purple-400" : "bg-blue-500"
                      }`} style={{ animationDelay: "300ms" }}></div>
                    </div>
                    <span className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}>
                      AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className={`backdrop-blur-xl rounded-2xl p-4 border transition-all duration-300 ${
            darkMode
              ? "bg-gray-800/50 border-gray-700/50"
              : "bg-white/50 border-gray-200/50"
          }`}>
            <form onSubmit={handleSubmit} className="flex gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className={`w-full px-4 py-3 sm:px-6 sm:py-4 rounded-xl border-0 focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                    darkMode
                      ? "bg-gray-700/50 text-white placeholder-gray-400 focus:ring-purple-500/50"
                      : "bg-gray-50/50 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50"
                  }`}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className={`px-4 py-3 sm:px-6 sm:py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  isLoading || !inputMessage.trim()
                    ? darkMode
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : darkMode
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/25"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25"
                }`}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar {
          width: 6px;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        
        .dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
          background-color: #4b5563;
        }
        
        .prose code {
          font-size: 0.875em;
        }
        
        .prose pre {
          font-size: 0.875em;
        }
      `}</style>
    </div>
  );
};

export default Chat;