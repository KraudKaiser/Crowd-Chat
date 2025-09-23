import { createBotImageMessage, createBotMessage, createBotTempMessage, createImageMessage, createUserMessage } from "@/lib/messages";
import { processImageRequest } from "@/lib/ProcessImageRequest";
import { ExistingChatStreamResponse } from "@/lib/ProcessStream";
import { roleTriggers } from "@/lib/RoleTriggers";
import { Message } from "@/types/message";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Lista de frases que indican que el usuario quiere una imagen
const imageTriggers = [
  "quiero que renderices una imagen",
  "quiero que crees una imagen",
  "genera una imagen",
  "dibuja una imagen",
  "haz un dibujo",
  "haz una ilustración",
];


// Codigo dado por chat gpt




export async function POST(req: Request) {
  try {
    const { message, history, tokens, model, historyLimit }: { message: string; history: Message[], tokens:number, model:string, historyLimit:number } = await req.json();

    const reducedHistory = history.slice(-historyLimit); // últimos 10 mensajes para contexto
    const wantsImage = imageTriggers.some((t) => message.toLowerCase().includes(t));

    const userRole =
      roleTriggers.find((r) =>
        r.phrases.some((p) => message.toLowerCase().includes(p))
      )?.role || "assistant";

    if (wantsImage) {
      // Caso imagen (JSON)
      const textResponse = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: "Te estan solicitando que crees una imagen. Tu trabajo es darle una respuesta afirmativa al usuario y confirmarle que estas generando la imagen textualmente" },
          { role: "user", content: message },
        ],
        max_tokens: 50,
      });

      const miniText = textResponse.choices[0]?.message?.content || "Aquí tienes la imagen:";

      const image = await openai.images.generate({
        model: "dall-e-2",
        prompt: message,
        size: "512x512",
      });

      const botMessage = createBotImageMessage(miniText, image.data[0].url);

      return NextResponse.json([botMessage],{
        status:200,
        headers:{
          "x-response-type":"json" 
        }
      });
    } else {
      // Caso texto (Streaming)
      const response = await openai.chat.completions.create({
        model: model,
        stream: true,
        max_completion_tokens:tokens,
        messages: [
          { role: "system", content: `Eres un ${userRole}. Responde breve y claro.` },
          ...reducedHistory.map((m) => ({
            role: m.owner === "you" ? "user" : "assistant",
            content: m.message,
          })),
          { role: "user", content: message },
        ],
      });

      const encoder = new TextEncoder();

      const stream = new ReadableStream({
        async start(controller) {

          let fullResponse = "";
          for await (const chunk of response) {
            const token = chunk.choices[0]?.delta?.content || "";
            if (token) {
              fullResponse += token;
              controller.enqueue(
                encoder.encode(
                  JSON.stringify({ type: "bot-temp", data: createBotTempMessage(fullResponse) }) + "\n"
                )
              );
            }
          }

          // 3. Emitir mensaje final del bot
          controller.enqueue(
            encoder.encode(
              JSON.stringify({ type: "bot", data: createBotMessage(fullResponse) }) + "\n"
            )
          );

          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
    "Content-Type": "text/event-stream; charset=utf-8", // o "application/x-ndjson"
    "Cache-Control": "no-cache, no-transform",
    "X-Accel-Buffering": "no",     // ayuda en algunos hosts a desactivar buffering
    "x-response-type": "stream",   // <-- CABECERA CLAVE
  },
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: `Error: ${e}` }, { status: 500 });
  }
}
