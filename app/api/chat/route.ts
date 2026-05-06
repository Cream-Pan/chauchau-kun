import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { PERSONAS, PersonaId } from "@/constants/personas";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const personaId = formData.get("personaId") as PersonaId | null;
    const userMessage = formData.get("message") as string | null;
    const historyJson = formData.get("history") as string | null;

    if (!file || !personaId) {
      return NextResponse.json({ error: "Data missing" }, { status: 400 });
    }

    const persona = PERSONAS[personaId];
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const pastMessages = historyJson ? JSON.parse(historyJson) : [];
    
    const contents = [];

    const pdfPart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type || "application/pdf",
      },
    };

    if (pastMessages.length > 0) {
      pastMessages[0].parts.unshift(pdfPart);
      
      contents.push(...pastMessages);
      
      contents.push({
        role: "user",
        parts: [{ text: userMessage || "" }],
      });
    } else {
      contents.push({
        role: "user",
        parts: [
          pdfPart,
          {
            text: userMessage || "この資料を読んで研究テーマとゴールを把握し、あなたの視点で進捗について質問をしてください。",
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: persona.systemInstruction,
      },
      contents: contents,
    });

    return NextResponse.json({ text: response.text ?? "" });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}