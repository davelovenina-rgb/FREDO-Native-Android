import { GoogleGenerativeAI } from '@google/generative-ai';

// API key is loaded from environment variable at build time
// Set EXPO_PUBLIC_GEMINI_API_KEY in your local .env file
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

export const sendMessage = async (
  messages: ChatMessage[],
  systemInstruction?: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction || undefined,
    });

    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
    });

    const result = await chat.sendMessage('');
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const sendMessageWithNewPrompt = async (
  messages: ChatMessage[],
  newMessage: string,
  systemInstruction?: string
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction || undefined,
    });

    const chat = model.startChat({
      history: messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};
