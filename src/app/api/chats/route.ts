import { imageTriggers } from "@/lib/ImageTriggers";
import { roleTriggers } from "@/lib/RoleTriggers";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// Detecta si el mensaje del usuario pide una imagen
function detectWantsImage(message: string): boolean {
  return imageTriggers.some((trigger) =>
    message.toLowerCase().includes(trigger)
  );
}

// Detecta el rol que debe tomar la IA
 
function detectUserRole(message: string): string {
  return (
    roleTriggers.find((r) =>
      r.phrases.some((p) => message.toLowerCase().includes(p))
    )?.role || "assistant"
  );
}

// Genera un mensaje de acompañamiento y una imagen
async function generateImageResponse(message: string, model:string) {
  // Mensaje corto de acompañamiento
  const textResponse = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content:
          "Un proceso alterno creará una imagen. Responde brevemente al usuario indicando que generarás esa imagen.",
      },
      { role: "user", content: message },
    ],
    max_tokens: 50,
  });

  const miniText =
    textResponse.choices[0]?.message?.content || "Aquí tienes la imagen:";

  // Imagen
  const imageResult = await openai.images.generate({
    model: "dall-e-2",
    prompt: message,
    size: "512x512",
  });

  return {
    type: "image_with_text",
    message: miniText,
    url: imageResult.data[0].url,
  };
}

// Genera una respuesta en streaming de texto
 
async function streamChatResponse(message: string, userRole: string, max_tokens:number, model:string) {
    try{

        const response = await openai.chat.completions.create({
            model: model,
            stream: true,
            max_completion_tokens: max_tokens,
            messages: [
                {
                    role: "system",
                    content: `Eres un ${userRole}. Responde como tal, breve y claro para el usuario.`,
                },
                { role: "user", content: message },
            ],
        });
        
        // Funcion que analiza la respuesta en forma de Stream y la construye
        const encoder = new TextEncoder();
        
        const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
          const token = chunk.choices[0]?.delta?.content || "";
          controller.enqueue(encoder.encode(token));
        }
        controller.close();
    },
});
return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
});
}catch(e){
    throw new Error(e)
}
}


export async function POST(req: Request) {
  try {
      const { message, tokens, model } = await req.json();
      
     
    const wantsImage = detectWantsImage(message);
    const userRole = detectUserRole(message);

    

    if (wantsImage) {
      // Caso imagen
      const imageResponse = await generateImageResponse(message, model);
      return NextResponse.json(imageResponse);
    } else {
        // Caso texto (streaming)
      return await streamChatResponse(message, userRole, tokens, model);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Ha ocurrido un error: ${error}` },
      { status: 500 }
    );
  }
}
