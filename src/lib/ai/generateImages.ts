import OpenAI from "openai";
import { createBotImageMessage } from "@/lib/messages";

export async function generateImageResponse(openai: OpenAI, prompt: string, model: string) {
  const textResponse = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: "Confirma al usuario que estás generando la imagen." },
      { role: "user", content: prompt },
    ],
    max_tokens: 50,
  });

  const miniText = textResponse.choices[0]?.message?.content || "Aquí tienes la imagen:";

  const image = await openai.images.generate({
    model: "dall-e-2",
    prompt,
    size: "512x512",
  });

  return createBotImageMessage(miniText, image.data[0].url);
}
