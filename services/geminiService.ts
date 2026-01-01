import { GoogleGenAI, Type } from "@google/genai";
import { Word } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Prompt for generating the specific artistic style required
const GENERATE_HOOK_PROMPT = `
You are a poetic philologist. Generate memory aids for the following vocabulary word.
Strict Rules:
1. "hookL1": A memory hook short sentence. MUST be between 10 and 18 Chinese characters. Abstract, artistic, theoretical context. NO jokes, NO puns, NO daily life slang.
2. "hookL2": A deeper philosophical or etymological connection.
3. "comparison": A short sentence correcting a common misconception in the format "并不是[Common Mistake]，而是[Correct Nuance]".
4. "confusers": Generate 3 plausible but incorrect definitions (Chinese).
5. "definition": The concise, correct definition (Chinese).

Output in JSON.
`;

export const generateWordContent = async (term: string): Promise<Partial<Word>> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-latest',
      contents: `${GENERATE_HOOK_PROMPT} Word: "${term}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hookL1: { type: Type.STRING },
            hookL2: { type: Type.STRING },
            comparison: { type: Type.STRING },
            definition: { type: Type.STRING },
            confusers: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return data;
  } catch (error) {
    console.error("Gemini generation failed", error);
    // Fallback for MVP stability if API fails
    return {
      hookL1: "词义如雾中风景，需静心凝视方见真容。",
      hookL2: "暂时无法获取深度解析，请稍后重试。",
      comparison: "定义暂时缺席",
      definition: "未知定义",
      confusers: ["错误选项A", "错误选项B", "错误选项C"]
    };
  }
};

export const parseCSV = (content: string): string[] => {
  // Simple CSV parser assuming one word per line or comma separated
  const lines = content.split(/[\r\n,]+/);
  return lines.map(s => s.trim()).filter(s => s.length > 0);
};
