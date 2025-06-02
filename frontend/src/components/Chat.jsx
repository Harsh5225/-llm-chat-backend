/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Chat = ({ onLogout }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
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
      const response = await axios.get(
        "http://localhost:3000/api/chat/history"
      );
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
      const response = await axios.post("http://localhost:3000/api/chat", {
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
      await axios.delete("http://localhost:3000/api/chat/history");
      setMessages([
        {
          role: "model",
          content: `Chat history cleared. How can I assist you today?`,
        },
      ]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          darkMode
            ? "bg-gradient-to-r from-purple-900 to-indigo-900"
            : "bg-gradient-to-r from-blue-600 to-purple-600"
        } text-white p-4 shadow-md`}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Chat Assistant</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707a1 1 0 001.414 1.414zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            <div className="flex items-center space-x-2">
              <img
                src={
                  user?.avatar ||
                  `https://ui-avatars.com/api/?name=${
                    user?.name || "User"
                  }&background=random&color=fff`
                }
                alt="User Avatar"
                className="h-8 w-8 rounded-full border-2 border-white"
              />
              <span className="font-medium">{user?.name || "User"}</span>
            </div>
            <div className="relative group">
              <button className="bg-gray border border-gray-400 bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1">
                <span>Menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out z-10`}
                style={{ transform: "translateY(10px)", top: "100%" }}
              >
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={clearChat}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Clear Chat History
                    </div>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    type="button"
                    role="menuitem"
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-6xl mx-auto h-full flex flex-col p-4">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-3/4 rounded-lg p-4 ${
                    message.role === 'user' 
                      ? darkMode 
                        ? 'bg-indigo-800 text-white rounded-br-none' 
                        : 'bg-blue-600 text-white rounded-br-none'
                      : darkMode
                        ? 'bg-gray-800 text-white rounded-bl-none shadow-md' 
                        : 'bg-white text-gray-800 rounded-bl-none shadow-md'
                  }`}
                >
                  {message.role === 'model' ? (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="markdown-content whitespace-pre-wrap"
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className={`flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 shadow-sm ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
                  : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
              }`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className={`p-3 rounded-full ${
                isLoading || !inputMessage.trim()
                  ? darkMode
                    ? "bg-gray-700 cursor-not-allowed"
                    : "bg-gray-400 cursor-not-allowed"
                  : darkMode
                  ? "bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              } text-white shadow-sm transition-colors duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;


