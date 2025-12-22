import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const getApiKey = () => {
  // 1. Check process.env (Vercel/Build time)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  // 2. Check LocalStorage (Runtime manual entry)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('gemini_api_key') || '';
  }
  return '';
};

const getAI = () => {
    // Always check for a fresh key in case the user just updated it in settings
    const key = getApiKey();
    
    if (!ai && key) {
        ai = new GoogleGenAI({ apiKey: key });
    } else if (ai && key && (ai as any).apiKey !== key) {
        // If key changed (e.g. user updated it manually), re-init
        ai = new GoogleGenAI({ apiKey: key });
        chatSession = null; // Reset chat session on key change
    }
    return ai;
}

export const getChatResponse = async (userMessage: string): Promise<string> => {
  const currentAI = getAI();
  
  if (!currentAI) {
    return "The spirits are silent (API Key missing). Please ask the Receptionist to connect, or ensure your API Key is set.";
  }

  try {
    if (!chatSession) {
      chatSession = currentAI.chats.create({
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

export const getStyleRecommendation = async (description: string): Promise<string> => {
  return getChatResponse(`Recommend a style for someone who looks like this: ${description}`);
};