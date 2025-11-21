import { GoogleGenAI, Type } from "@google/genai";
import { Attraction, OptimizationResult } from '../types';

// Initialize AI client
// The API key availability is handled by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeItinerary = async (
  topAttractions: Attraction[]
): Promise<OptimizationResult> => {
  try {
    const model = 'gemini-2.5-flash';

    const attractionListString = topAttractions
      .map(a => `- ${a.name} (ID: ${a.id}, Park: ${a.park}, Land: ${a.land}, Coords: [${a.x}, ${a.y}])`)
      .join('\n');

    const prompt = `
      You are a Disneyland Paris logistics expert. 
      I have a list of the group's TOP voted attractions for Disneyland Park.
      Please create an optimized walking path to visit these attractions efficiently.
      
      Consider:
      1. Start generally from Main Street USA (Entrance).
      2. Minimize walking distance between lands (Main Street -> Frontierland/Discoveryland -> Adventureland -> Fantasyland loop).
      3. Group attractions by Land to avoid zig-zagging across the park.
      
      Attractions:
      ${attractionListString}

      Return the result strictly as JSON containing only the optimized path.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            path: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of Attraction IDs in the optimized order"
            }
          },
          required: ["path"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
        throw new Error("Empty response from AI");
    }
    
    return JSON.parse(resultText) as OptimizationResult;

  } catch (error) {
    console.error("Optimization failed", error);
    // Fallback: just return original order if AI fails
    return {
      path: topAttractions.map(a => a.id)
    };
  }
};