import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function processImageRequest(openai: OpenAI, prompt: string) {
  
  const textResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Un proceso alterno creará una imagen. Responde breve que la imagen fue generada.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 50,
  });

  const miniText =
    textResponse.choices[0]?.message?.content || "Aquí tienes la imagen:";

  const result = await openai.images.generate({
    model: "dall-e-2",
    prompt,
    size: "512x512",
  });

  return NextResponse.json({
    type: "image_with_text",
    message: miniText,
    url: result.data[0]?.url ,
  });
}
