
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  generateSoapDescription: async (name: string, category: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Menga "${name}" nomli, "${category}" turkumiga kiruvchi tabiiy qo'lda yasalgan sovun uchun jozibador va marketingbop qisqa tavsif yozib ber. O'zbek tilida bo'lsin.`,
        config: {
          temperature: 0.7,
        }
      });
      return response.text || "Tavsif yaratib bo'lmadi.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Tabiiy va foydali mahsulot.";
    }
  }
};
