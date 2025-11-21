import { GoogleGenerativeAI } from "@google/generative-ai";
import { Transaction, Message } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ Gemini API key is missing! Set VITE_GEMINI_API_KEY in your .env file.");
}

const ai = new GoogleGenerativeAI(API_KEY!);

// Format transactions for prompt
const formatTransactionsForPrompt = (transactions: Transaction[]): string => {
  if (transactions.length === 0) return "No recent transactions found.";
  return transactions
    .slice(0, 10)
    .map(
      (t) => `- ${t.type} ₹${t.amount.toFixed(2)} (${t.description} - ${t.category})`
    )
    .join("\n");
};

// Generate financial advice
export const getAdvice = async (transactions: Transaction[]): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please check your setup.";
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const transactionsSummary = formatTransactionsForPrompt(transactions);

    const prompt = `
You are FinCoach, an intelligent and friendly AI financial assistant.
The user’s recent transactions are:
${transactionsSummary}

Based on this, provide a short, encouraging, personalized financial insight in 2–3 lines.
Use a positive, natural tone. Example:
"You're doing great! Maybe reduce your food delivery spending this week — your savings will thank you 😄."
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error fetching advice from Gemini API:", error);
    return "I'm having trouble coming up with advice right now. Please try again later.";
  }
};

// Chat conversation
export const getChatResponse = async (history: Message[], newMessage: string): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please check your setup.";
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
    const chatHistory = history.map((msg) => `${msg.sender}: ${msg.text}`).join("\n");

    const prompt = `
You are FinCoach, a helpful and encouraging AI financial assistant.
Keep responses concise, friendly, and insightful.

Conversation so far:
${chatHistory}
User: ${newMessage}
AI:
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("❌ Error fetching chat response from Gemini API:", error);
    return "Sorry, I'm having trouble connecting. Try again later.";
  }
};
