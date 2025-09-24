"use client"

import { Historial } from "@/types/historial";
import { ScrollArea } from "../ui/scroll-area";
import { EllipsisAnimation } from "../ui/shadcn-io/spinner";

export default function ChatHistorial({ chat, receivingAnswer }: { chat: Historial, receivingAnswer:boolean }) {
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
                  <div className="bg-blue-900 p-2 rounded-md flex flex-col w-[50%] h-full" key={message.id}>
                    <p className=" font-mono font-semibold text-white">
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
                      ? "bg-blue-900 self-start"
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
            {
              receivingAnswer && (  
                  <div className=" p-2 rounded-md flex items-center justify-center gap-4 w-[50%] h-full">
                    <p className="text-white font-bold">Generando respuesta...</p>
                    <EllipsisAnimation size={50} className="text-white" />
                  </div>
              )
            }
          </div>
        </ScrollArea>
      )}
    </section>
  );
}
