# LLM Chat Application

![LLM Chat](https://img.shields.io/badge/LLM-Chat-blue)
![Google Gemini](https://img.shields.io/badge/Google-Gemini-red)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![React](https://img.shields.io/badge/React-Frontend-61DAFB)
![Express](https://img.shields.io/badge/Express-Backend-black)

A full-stack AI chat application powered by Google's Gemini model with persistent chat history, user authentication, and a responsive UI.

![App Screenshot](https://via.placeholder.com/800x400?text=LLM+Chat+Application)

## Features

- 🤖 **AI-Powered Chat**: Integrates with Google Gemini for intelligent, context-aware responses
- 🔐 **User Authentication**: Secure JWT-based authentication system
- 💾 **Persistent Chat History**: All conversations are saved to MongoDB
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode**: Toggle between light and dark themes
- ✨ **Modern UI**: Built with React and styled with Tailwind CSS
- 📝 **Markdown Support**: Chat messages support Markdown formatting
- 🔄 **Real-time Updates**: Messages appear instantly without page refresh

## Tech Stack

### Backend
- **Node.js & Express**: Server framework
- **MongoDB**: Database for user data and chat history
- **Google Gemini API**: AI model for generating responses
- **JWT**: Authentication mechanism
- **Mongoose**: MongoDB object modeling

### Frontend
- **React**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Navigation and routing
- **Axios**: HTTP client
- **React Markdown**: Markdown rendering

## Getting Started

### Prerequisites
- Node.js 
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/llm-chat-application.git
   cd llm-chat-application
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   API_KEY=your_google_gemini_api_key
   PORT=3000
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   
   Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the application**
   
   In the backend directory:
   ```bash
   npm start
   ```
   
   In the frontend directory:
   ```bash
   npm run dev
   ```

5. **Access the application**
   
   Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or log in to access the chat interface
2. **Start Chatting**: Type your message in the input field and press Enter or click Send
3. **View History**: Scroll up to see previous messages in the conversation
4. **Toggle Theme**: Click the theme toggle button to switch between light and dark mode
5. **Logout**: Click the logout button when finished

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive JWT token

### Chat
- `POST /api/chat` - Send a message and get AI response
- `GET /api/chat/history` - Get chat history for the authenticated user
- `DELETE /api/chat/history` - Clear chat history

## Deployment

### Backend
The backend can be deployed to services like:
- Heroku
- Railway
- Render
- AWS

### Frontend
The frontend can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Future Enhancements

- Voice input and output
- Multiple conversation threads
- File upload and sharing
- User preferences and settings
- Integration with additional LLM models
- Real-time chat with WebSockets

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini for the AI capabilities
- The React and Node.js communities for excellent documentation
- All open-source libraries used in this project

---

Made with ❤️ by [Harsh](https://github.com/Harsh5225)

