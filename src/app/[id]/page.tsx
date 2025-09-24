"use client"

import ChatHistorial from "@/components/chat/ChatHistorial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/context/SettingsContext";
import { useGetChats } from "@/hooks/useChats";
import { createUserMessage } from "@/lib/messages";
import {processStreamExistingChat } from "@/lib/ProcessStream";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SendHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { id } = useParams()
  const { chats, setChats, loading } = useGetChats()
  const {settings} = useSettings()
  const [indexWanted, setIndexWanted] = useState<number | null>(null)
  const [prompt, setPrompt] = useState("")
  const [error, setError] = useState<boolean>(false)
  const [receivingAnswer, setReceivingAnswer] = useState<boolean>(false)

  
  useEffect(() => {
    if (!loading) {
      setIndexWanted(chats.findIndex((chat) => chat.id === id))
    }
  }, [loading])

 const addMessage = async (
  e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
) => {
  if (
    ("key" in e && e.key !== "Enter") &&
    !("_reactName" in e && e._reactName === "onClick")
  ) return;

  if (!prompt.trim() || indexWanted === null) return;

  const newMessage = createUserMessage(prompt);


  setChats((prev) =>
    prev.map((c, i) =>
      i === indexWanted ? { ...c, messages: [...c.messages, newMessage] } : c
    )
  );

  //setea variables para mostrar la generacion de respuesta
  setPrompt("");
  setReceivingAnswer(true)

  const res = await fetch(`/api/chats/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: prompt,
      history: chats[indexWanted].messages,
      historyLimit:settings.includeHistory,
      model:settings.model,
      tokens:settings.maxTokens,
    }),
  });

  if (res.status === 401) {
      // Mensaje especial si falta o es incorrecta la API Key
      setError(true)
      return;
    }

  const responseType = res.headers.get("x-response-type") || "";
  const contentType = (res.headers.get("content-type") || "").toLowerCase();
  
  //Este caso busca json para analizar URLS con posibles imagenes.
  if (responseType === "json" || contentType.includes("application/json")) {
   
    const messages = await res.json(); 
    setChats(prev =>
      prev.map((c, i) => i === indexWanted ? { ...c, messages: [...c.messages, ...messages] } : c)
    );
    setReceivingAnswer(false)
    setPrompt("")
  }
  
  //Busca si existe Stream de mensajes de distintas formas. 
  else if (responseType === "stream" || contentType.includes("text/event-stream") || contentType.includes("application/x-ndjson")) {
    // Stream: procesar en tiempo real
    await processStreamExistingChat(res.body, indexWanted, setChats);
    setReceivingAnswer(false)
    setPrompt("")
  } else if (res.body) {
    // Fallback: intentar stream si hay body, usar processStream
    await processStreamExistingChat(res.body, indexWanted, setChats);
    setReceivingAnswer(false)
    setPrompt("")
} else {
  console.error("Respuesta desconocida del backend");
} 

}

  if (loading) {
    return (
    <main className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <ScrollArea className="w-full h-full">
          <span>Cargando...</span>
        </ScrollArea>
      </div>
      <section className="flex  items-center bg-gray-800 border rounded-sm border-gray-600 p-2">
        <Input onKeyDown={(e) => addMessage(e)} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="border-none focus-visible:ring-0
      font-mono text-white
      "></Input>
        <Button onClick={(e) => addMessage(e)} disabled={prompt.length == 0} className={`bg-gray-800 `}>
          <SendHorizontal className={`${prompt.length == 0 ? "opacity-0" : "opacity-100"} transition-opacity ease-in-out duration-200`} />
        </Button>
      </section>
    </main>
    )
  }

  if(error){
    return(
       <main className="flex flex-col h-screen bg-gray-900">
      <div className="bg-red-500 text-center p-6 text-white font-bold flex-1 flex justify-center items-center overflow-hidden">
          <h1>Ha ocurrido un error: Es probable que no hayas insertado tu API KEY en un archivo de entorno (.env)
            Recomendamos: Colocar la API Key en el archivo .env y reiniciar la aplicacion
          </h1>
      </div>
      <section className="flex  items-center bg-gray-800 border rounded-sm border-gray-600 p-2">
        <Input onKeyDown={(e) => addMessage(e)} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="border-none focus-visible:ring-0
      font-mono text-white
      "></Input>
        <Button onClick={(e) => addMessage(e)} disabled={prompt.length == 0} className={`bg-gray-800 `}>
          <SendHorizontal className={`${prompt.length == 0 ? "opacity-0" : "opacity-100"} transition-opacity ease-in-out duration-200`} />
        </Button>
      </section>
    </main>
    )
  }

  return (
    <main className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <ChatHistorial chat={chats[indexWanted]} receivingAnswer={receivingAnswer} />
      </div>
      <section className="flex  items-center bg-gray-800 border rounded-sm border-gray-600 p-2">
        <Input
          onKeyDown={(e) => addMessage(e)}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border-none focus-visible:ring-0
      font-mono text-white
      "
          placeholder="Escribe tu mensaje..."
        ></Input>
        <Button onClick={(e) => addMessage(e)} disabled={prompt.length == 0} className={`bg-gray-800 `}>
          <SendHorizontal className={`${prompt.length == 0 ? "opacity-0" : "opacity-100"} transition-opacity ease-in-out duration-200`} />
        </Button>
      </section>
    </main>
  )
}