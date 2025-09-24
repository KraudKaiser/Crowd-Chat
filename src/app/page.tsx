"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import { useGetChats } from "@/hooks/useChats";
import { useRouter } from "next/navigation";
import { processStreamNewChat } from "@/lib/ProcessStream";
import { useSettings } from "@/context/SettingsContext";
import { EllipsisAnimation } from "@/components/ui/shadcn-io/spinner";
import { createUserMessage } from "@/lib/messages";

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<boolean>(false)
  const [tempMessage, setTempMessage] = useState<string | null>(null);
  const [receivingAnswer, setReceivingAnswer] = useState<boolean>(false);
  const { setChats } = useGetChats();
  const { settings } = useSettings();
  
  
  const createChat = async () => {
    if (receivingAnswer) return; 
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setError(false)
    setPrompt("");
    setTempMessage(trimmed);
    setReceivingAnswer(true);
    
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed,
          message: trimmed,
          model: settings.model,
          tokens: settings.maxTokens,
        }),
      });

      if (res.status === 401) {
      // Mensaje especial si falta o es incorrecta la API Key
      console.log(res)
      setError(true)
      return
    }
      if (!res.ok) {
      console.log("Error en la respuesta del servidor", res.status);
      setError(true);
      return;
    }

      const newChatId = await processStreamNewChat(trimmed, res, setChats);

    
      if (newChatId) {
        router.push(`/${newChatId}`);
      }
    } catch (err) {
      console.error("Error creando chat:", err);
      
    } finally {
     
      setTempMessage(null);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void createChat();
    }
  };

 
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    void createChat();
  };

  

  return (
    <main className="flex flex-col h-screen">
      {
        error && (
           <div className="bg-red-500 text-center p-6 text-white font-bold flex-1 flex justify-center items-center overflow-hidden">
              <h1>Ha ocurrido un error: Es probable que no hayas insertado tu API KEY en un archivo de entorno (.env)
                Recomendamos: Colocar la API Key en el archivo .env y reiniciar la aplicacion
              </h1>
            </div>
        )
      }
      {!receivingAnswer && !tempMessage && (
        <div className="flex flex-1 justify-center items-center">
          <h1 className="font-mono font-semibold text-4xl text-white text-center">
            ¿Qué deseas consultarme? :)
          </h1>
        </div>
      )}

     
      {receivingAnswer && tempMessage && (
        <section className="flex flex-col flex-1 p-4 gap-4">
          <div className="self-end bg-gray-500 rounded-md p-2 max-w-[70%]">
            <p className="font-mono font-semibold text-white">{tempMessage}</p>
          </div>

          <div className="self-start flex items-center gap-3 bg-gray-700 rounded-md p-2 max-w-[70%]">
            <p className="text-white font-bold">Generando respuesta...</p>
            <EllipsisAnimation size={30} className="text-white" />
          </div>
        </section>
      )}

      <section className="flex items-center bg-gray-800 border-t border-gray-600 p-2">
        <Input
          onKeyDown={handleKeyDown}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 border-none focus-visible:ring-0 font-mono text-white bg-gray-700 placeholder:text-gray-300"
          placeholder="Escribe tu mensaje..."
        />
        <Button
          type="button"
          onClick={handleClick}
          disabled={!prompt.trim() || receivingAnswer}
          className={`hover:cursor-pointer ml-2 ${prompt != "" ? "bg-gray-700" : "bg-gray-800"}`}
        >
          <SendHorizontal
            className={`${
              prompt.length === 0 ? "opacity-0" : "opacity-100"
            } transition-opacity ease-in-out duration-200`}
          />
        </Button>
      </section>
    </main>
  );
}
