"use client"

import { Historial } from "@/types/historial";
import { ScrollArea } from "../ui/scroll-area";
import Image from "next/image";

export default function ChatHistorial({ chat }: { chat: Historial }) {
  if (!chat || !chat.messages) {
    return <h1>No hay chats</h1>;
  }
  
  return (
    <section className="h-full flex flex-1  p-2 ">
      {chat.messages.length === 0 ? (
        <h1 className="text-4xl font-mono text-white">
          ¿Qué quieres pedirme hoy?
        </h1>
      ) : (
        <ScrollArea className="w-full h-full p-4 overflow-y-auto">
          <div className="flex flex-col gap-2 w-full">
            {chat.messages.map((message) => {
              if (message.type == "image_with_text" || message.type == "image") {
                return (
                <div className="flex flex-col w-[50%] h-full" key={message.id}>
                    <p className="font-mono font-semibold text-white">
                      {message.message}
                    </p>
                    <img src={message.url} alt="Imagen" />
                </div>
                )
              }
              if (message.type == "text" || message.type == null) {
                return (
                  <div
                    key={message.id}
                    className={`p-2 rounded-md break-words max-w-[70%] ${
                      message.owner != "you"
                        ? "bg-amber-400 self-start"
                        : "bg-gray-500 self-end"
                    }`}
                  >
                    <p className="font-mono font-semibold text-white">
                      {message.message}
                    </p>
                  </div>
                );
              }
            })}
          </div>
        </ScrollArea>
      )}
    </section>
  );
}
