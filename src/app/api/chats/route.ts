import { NextResponse } from "next/server";
import OpenAI from "openai";

import { detectWantsImage } from "@/lib/ai/detectImage";
import { detectUserRole } from "@/lib/ai/detectUserRole"; // podemos separarlo en helper
import { generateImageResponse } from "@/lib/ai/generateImages";
import { streamTextResponse } from "@/lib/ai/streamText";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { message, tokens, model } = await req.json();

    const wantsImage = detectWantsImage(message);
    const userRole = detectUserRole(message);

    if (wantsImage) {
      // Imagen: delega al helper
      const botMessage = await generateImageResponse(openai, message, model);
      return NextResponse.json(botMessage, {
        status: 200,
        headers: { "x-response-type": "json" },
      });
    }

    // Texto: delega al helper de streaming
    const messages = [
      {
        role: "system",
        content: `Eres un ${userRole}. Responde breve y claro.`,
      },
      { role: "user", content: message },
    ];

    return await streamTextResponse(openai, model, tokens, messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Ha ocurrido un error: ${error}` },
      { status: 500 }
    );
  }
}
