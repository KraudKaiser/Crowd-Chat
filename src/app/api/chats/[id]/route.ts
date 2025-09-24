import { NextResponse } from "next/server";
import OpenAI from "openai";
import { detectWantsImage } from "@/lib/ai/detectImage";
import { buildMessages } from "@/lib/ai/buildMessages";
import { generateImageResponse } from "@/lib/ai/generateImages";
import { streamTextResponse } from "@/lib/ai/streamText";
import { roleTriggers } from "@/lib/RoleTriggers";
import { Message } from "@/types/message";
import { detectUserRole } from "@/lib/ai/detectUserRole";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: Request) {
  try {
    const { message, history, tokens, model, historyLimit }:
      { message: string; history: Message[]; tokens: number; model: string; historyLimit: number } = await req.json();

    const userRole = detectUserRole(message)

    if (detectWantsImage(message)) {
      const botMessage = await generateImageResponse(openai, message, model);
      return NextResponse.json([botMessage], {
        status: 200,
        headers: { "x-response-type": "json" },
      });
    }

    const messages = buildMessages(history, historyLimit, message, userRole);
    return await streamTextResponse(openai, model, tokens, messages);
  } catch (e) {
    if (e.code == "invalid_api_key" || e.message.includes("Invalid API key")) {
      return NextResponse.json(
        { error: "La API Key no está configurada o es inválida." },
        { status: 401 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: `Error: ${e}` }, { status: 500 });
  }
}
