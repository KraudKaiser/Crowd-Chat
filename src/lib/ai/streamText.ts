import OpenAI from "openai";
import { createBotMessage, createBotTempMessage } from "@/lib/messages";
import { Historial } from "@/types/historial";

export async function streamTextResponse(
  openai: OpenAI,
  model: string,
  tokens: number,
  messages: any[],
) {
  const response = await openai.chat.completions.create({
    model,
    stream: true,
    max_completion_tokens: tokens,
    messages,
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
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
      "x-response-type": "stream",
    },
  });
}
