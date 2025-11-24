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
      Goal: Create the most efficient walking path to visit these 15 attractions.
      
      CRITICAL GEOGRAPHY RULES (Disneyland Paris):
      1. Entrance is Main Street USA (South).
      2. From Main Street, usual flow is counter-clockwise: Frontierland -> Adventureland -> Fantasyland -> Discoveryland.
      3. OR Clockwise: Discoveryland -> Fantasyland -> Adventureland -> Frontierland.
      4. DO NOT jump back and forth between lands (e.g. Frontierland to Discoveryland then back to Adventureland). Finish one land before moving to the next.
      
      Attractions to visit:
      ${attractionListString}

      Instructions:
      - Reorder the list to minimize walking distance.
      - Group attractions by Land.
      - Start with attractions in Main Street or the first land (Frontierland or Discoveryland).
      
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
              description: "Ordered list of attraction IDs"
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