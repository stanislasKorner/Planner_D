import { GoogleGenAI, Type } from "@google/genai";
import { Attraction, OptimizationResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const optimizeItinerary = async (
  topAttractions: Attraction[]
): Promise<OptimizationResult> => {
  try {
    const model = 'gemini-2.5-flash';

    const attractionListString = topAttractions
      .map(a => `- ${a.name} (ID: ${a.id}, Land: ${a.land}, X: ${a.x}, Y: ${a.y})`)
      .join('\n');

    const prompt = `
      You are an expert guide for Disneyland Paris.
      Goal: Create the most efficient walking path to visit these attractions.
      
      CRITICAL GEOGRAPHY RULES (Disneyland Paris):
      1. Start at Main Street USA (South).
      2. Go clockwise: Frontierland -> Adventureland -> Fantasyland -> Discoveryland.
      3. Group attractions by land to minimize walking.
      
      Attractions:
      ${attractionListString}
      
      Return strictly JSON:
      { "path": ["id1", "id2", ...] }
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
              description: "Ordered IDs"
            }
          },
          required: ["path"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText) as OptimizationResult;

  } catch (error) {
    console.error("Optimization failed", error);
    return {
      path: topAttractions.map(a => a.id)
    };
  }
};