import { Chats } from "@/types/chats";
import { Historial } from "@/types/historial";
import { Message } from "@/types/message";
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
}export async function processStreamNewChat(
  prompt: string,
  res: Response,
  setChats: React.Dispatch<React.SetStateAction<Chats>>
) {
  if (!res.body) return;
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let chatId: string | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const lines = decoder.decode(value).split("\n").filter(Boolean);

    for (const line of lines) {
      const { type, data }: { type: string; data: Message } = JSON.parse(line);

      // Error de Tipos que no encontre solucion. pese a estar marcado que Chats es de tipo Chats
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
                id: uuidv4(),
                message: prompt,
                url: null,
                timestamp: Date.now().toString(),
                owner: "you",
                type: "text",
              },
            ],
          },
        ]);
      }

      // Actualizar mensajes
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId
            ? {
                ...c,
                messages: [
                  ...c.messages.filter((m) =>
                    type === "bot-temp" || type === "bot"
                      ? m.owner !== "bot-temp"
                      : true
                  ),
                  data,
                ],
              }
            : c
        )
      );
    }
  }

  return chatId;
}
