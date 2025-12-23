import { GoogleGenAI, Chat } from "@google/genai";

let ai: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

export const getApiKey = () => {
  // Hardcoded key as the primary source of truth for this deployment
  const key = 'AIzaSyCS26MJIMoPhb0Oic-3nvE7hL-6wlybuRQ';
  
  // Optional: Check environment variables if available (e.g. valid Node environment)
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  
  // Optional: Check window polyfill
  if (typeof window !== 'undefined' && (window as any).process?.env?.API_KEY) {
      return (window as any).process.env.API_KEY;
  }

  return key;
};

const getAI = () => {
    const key = getApiKey();
    
    // Initialize AI if not already initialized
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: key });
    } 
    return ai;
}

export const getChatResponse = async (userMessage: string): Promise<string> => {
  const currentAI = getAI();
  
  if (!currentAI) {
    return "Service temporarily unavailable. Please try again later.";
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
    // Reset session on error to prevent stuck states
    chatSession = null;
    return "I am having a moment of silence. Please ask me again.";
  }
};

export const getStyleRecommendation = async (description: string): Promise<string> => {
  return getChatResponse(`Recommend a style for someone who looks like this: ${description}`);
};