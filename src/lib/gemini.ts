import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export const geminiModel = "gemini-3-flash-preview";

export interface LessonContent {
  title: string;
  explanation: {
    simple: string;
    advanced: string;
  };
  examples: string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const generateLesson = async (subject: string, language: 'th' | 'en' = 'th'): Promise<LessonContent> => {
  const prompt = `Generate a lesson about ${subject} in ${language === 'th' ? 'Thai' : 'English'}.
  Return as JSON with title, explanation (simple and advanced), and 3 examples.`;

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          explanation: {
            type: Type.OBJECT,
            properties: {
              simple: { type: Type.STRING },
              advanced: { type: Type.STRING }
            },
            required: ["simple", "advanced"]
          },
          examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "explanation", "examples"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateQuiz = async (topic: string, language: 'th' | 'en' = 'th'): Promise<QuizQuestion[]> => {
  const prompt = `Generate a quiz with 3-5 multiple choice questions about ${topic} in ${language === 'th' ? 'Thai' : 'English'}.
  Return as a JSON array of objects with question, options (4 strings), correctAnswer (0-3 index), and explanation.`;

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.INTEGER },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateTutorResponse = async (question: string, context: string, simple: boolean = false, language: 'th' | 'en' = 'th'): Promise<string> => {
  const prompt = `Student asked: "${question}"
  Current Lesson Context: "${context}"
  Language: ${language === 'th' ? 'Thai' : 'English'}
  Level: ${simple ? 'Explain as if I am 7 years old' : 'Standard educational explanation'}
  Respond concisely and helpfully.`;

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
  });

  return response.text || "";
};

export interface Scenario {
  title: string;
  situation: string;
  options: string[];
  correctIdx: number;
  feedback: string;
}

export const generateScenario = async (topic: string, language: 'th' | 'en' = 'th'): Promise<Scenario> => {
  const prompt = `Generate a life skills scenario about ${topic} in ${language === 'th' ? 'Thai' : 'English'}.
  Return as JSON with title, situation, 3 options, correctIdx (0-2), and feedback.`;

  const response = await ai.models.generateContent({
    model: geminiModel,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          situation: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctIdx: { type: Type.INTEGER },
          feedback: { type: Type.STRING }
        },
        required: ["title", "situation", "options", "correctIdx", "feedback"]
      }
    }
  });

  return JSON.parse(response.text);
};
