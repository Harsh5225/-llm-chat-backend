import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const main = async (msg) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: msg,
  });

  console.log(response.text); // Log before return
  return response.text;
  
};

//! Structure of a Message in Gemini Chat API

/*
{
  role: "user" | "model",
  parts: [
    { text: "..." }  // <-- this is the key part!
  ]
}
*/
