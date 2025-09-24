import { Message } from "@/types/message";

export function buildMessages(history: Message[], historyLimit: number, message: string, userRole: string) {
  const reducedHistory = history.slice(-historyLimit);

  return [
    { role: "system", content: `Eres un ${userRole}. Responde breve y claro.` },
    ...reducedHistory.map((m) => ({
      role: m.owner === "you" ? "user" : "assistant",
      content: m.message,
    })),
    { role: "user", content: message },
  ];
}
