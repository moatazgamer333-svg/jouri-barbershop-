import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to keep track of chat instances if needed, though for this simple app we might just re-create or pass the history.
let chatSession: Chat | null = null;

export const getChatResponse = async (userMessage: string): Promise<string> => {
  if (!apiKey) {
    return "The spirits are silent (API Key missing). Please check connection.";
  }

  try {
    if (!chatSession) {
      chatSession = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: `
            You are Jouri, the AI concierge for Jouri Barbershop in Marrakech.
            The shop is known for its stunning brick-wall aesthetic, modern vibes, and traditional Moroccan hospitality.
            Prices are in MAD (Moroccan Dirham).
            
            Services:
            - Jouri Signature (250 MAD)
            - Marrakech Fade (150 MAD)
            - Atlas Beard Sculpt (100 MAD)
            - Royal Scissor Cut (200 MAD)
            
            Location: 12 Avenue Mohammed V, Gueliz.
            
            Tone: Sophisticated, warm, welcoming, slight Moroccan flair (e.g., use "Marhba", "My friend").
            Answer questions about style, bookings (tell them to use the "Book Appointment" button), or general chat.
            Keep responses concise (max 2-3 sentences).
          `,
        },
      });
    }

    const result = await chatSession.sendMessage({ message: userMessage });
    return result.text || "I am listening...";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am having trouble connecting to the network right now. Please ask again in a moment.";
  }
};

// Keeping the old function signature for backward compatibility if needed, but wrapping the chat
export const getStyleRecommendation = async (description: string): Promise<string> => {
  return getChatResponse(`Recommend a style for someone who looks like this: ${description}`);
};