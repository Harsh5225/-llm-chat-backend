Here's a **detailed README** for your **LLM Chat Backend** with all the necessary sections, including Postman snapshots:

---

# LLM Chat Backend

## Overview

The **LLM Chat Backend** is an AI-powered chatbot service built using Node.js and Express. It integrates with Google Gemini's AI model to generate human-like responses. This backend application stores user messages and chat history in MongoDB and uses MongoDB's auto-generated `_id` for user identification.

The backend API receives messages, processes them using the Gemini model, and returns AI-generated responses. It is designed for easy integration with a frontend application in the future.

## Features
- User authentication with MongoDB's auto-generated `_id`.
- Chat history storage in MongoDB.
- Integration with Google Gemini API for AI-driven responses.
- REST API to interact with the chatbot.
- Easy to extend and integrate with a frontend.

## Tech Stack
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (MongoDB Atlas or local)
- **AI Integration:** Google Gemini API
- **Environment Variables:** dotenv for managing sensitive keys

---

## Getting Started

### Prerequisites
Ensure the following are installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [MongoDB](https://www.mongodb.com/) (use MongoDB Atlas for cloud or install locally)
- [Postman](https://www.postman.com/) (for testing the API)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/llm-chat-backend.git
   cd llm-chat-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```env
   MONGODB_URI=mongodb://localhost:27017/llmchat   # or use your MongoDB Atlas URI
   API_KEY=your-google-gemini-api-key
   ```

4. Start the application:
   ```bash
   npm start
   ```

Your server should now be running on `http://localhost:3000`.

---

## API Documentation

### POST `/chat`

Send a message to the AI and get a response, while saving the message and chat history to the user's document in MongoDB.

#### Request Body:

For the first interaction, **you don't need to include the `id` field**. The backend will automatically create the user and assign an `_id`.

```json
{
  "name": "Harsh", 
  "msg": "Do you remember my name?"
}
```

- `name`: The user's name (required for new users).
- `msg`: The message the user sends to the AI.

#### Response:
```json
{
  "reply": "Yes, I remember your name, Harsh!",
  "user": {
    "_id": "60c1e7309a4e3f12c8d43851",   // MongoDB auto-generated ID
    "name": "Harsh",
    "chatHistory": [ 
      { "role": "user", "content": "Do you remember my name?" },
      { "role": "model", "content": "Yes, I remember your name, Harsh!" }
    ]
  }
}
```

---

## Postman Testing

### Example 1: Sending a Message

**Request:**

1. Open Postman and set the method to **POST**.
2. Enter the URL `http://localhost:3000/chat`.
3. In the body, select **raw** and **JSON** format.
4. Add the following JSON body:

```json
{
  "name": "Harsh",
  "msg": "Do you remember my name?"
}
```

**Response:**

If everything is set up correctly, the response should be:

```json
{
  "reply": "Yes, I remember your name, Harsh!",
  "user": {
    "_id": "60c1e7309a4e3f12c8d43851",
    "name": "Harsh",
    "chatHistory": [
      { "role": "user", "content": "Do you remember my name?" },
      { "role": "model", "content": "Yes, I remember your name, Harsh!" }
    ]
  }
}
```

#### Postman Snapshots

1. **Request Setup in Postman:**

   ![Postman Request](https://user-images.githubusercontent.com/your-username/postman-request.png)

2. **Response in Postman:**

   ![Postman Response](https://user-images.githubusercontent.com/your-username/postman-response.png)

---

## Error Handling

In case of an error, the API will respond with an HTTP status code and a message:

```json
{
  "message": "Server Error"
}
```

The most common errors are related to incorrect API keys or database issues.

---

## Contributing

Feel free to fork the repository and submit pull requests. If you encounter any issues, please open an issue on GitHub.

## Future Plans

- Build a frontend interface for the chatbot.
- Enhance AI conversation features, including context retention and user preferences.
- Add user login and authentication features.
- Implement additional message handling, such as media support.

## License

This project is licensed under the MIT License.

---

