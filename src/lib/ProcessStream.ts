import { Chats } from "@/types/chats";
import { Message } from "@/types/message";
import { SetStateAction } from "react";
import { v4 as uuidv4 } from "uuid";

export async function processStreamExistingChat(
  res: ReadableStream<Uint8Array>,
  indexWanted: number,
  setChats: React.Dispatch<React.SetStateAction<Chats>>
) {
  const reader = res.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n").filter(Boolean);

    for (const line of lines) {
      const { type, data }: { type: string; data: Message } = JSON.parse(line);

      setChats((prev) =>
        prev.map((c, i) =>
          i === indexWanted
            ? {
                ...c,
                messages: [
                  ...c.messages.filter((m) =>
                    type === "bot-temp" || type === "bot" ? m.owner !== "bot-temp" : true
                  ),
                  data,
                ],
              }
            : c
        )
      );
    }
  }
}
export async function processStreamNewChat(
  prompt:string, 
  res: Response,
  setChats: React.Dispatch<React.SetStateAction<Chats>>
) {
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullResponse = "";

  let chatId: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    fullResponse += chunk;

    // Crear el chat nuevo en el primer chunk
    if (!chatId) {
      chatId = uuidv4();
      setChats((prev) => [
        ...prev,
        {
          id: chatId,
          createdAt: Date.now().toString(),
          title: prompt,
          messages: [
            {
              id:uuidv4(),
              message:prompt,
              url:null,
              timestamp:Date.now().toString(),
              owner:"you",
              type:"text"
            }
          ],
        },
      ]);
    }

    // Agregar mensaje temporal
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages.filter((m) => m.owner !== "bot-temp"),
                {
                  id: uuidv4(),
                  owner: "bot-temp",
                  type: "text",
                  message: fullResponse,
                  url: null,
                  timestamp: Date.now().toString(),
                },
              ],
            }
          : c
      )
    );
  }

  // Reemplazar temp por respuesta final
  if (chatId) {
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages.filter((m) => m.owner !== "bot-temp"),
                {
                  id: uuidv4(),
                  owner: "bot",
                  type: "text",
                  message: fullResponse,
                  url: null,
                  timestamp: Date.now().toString(),
                },
              ],
            }
          : c
      )
    );
  }

  return chatId;
}