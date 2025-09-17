"use client"
import ChatHistorial from "@/components/chat/ChatHistorial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";
import conversation from "@/Json/conversation.json"
import { useSearchParams } from "next/navigation";
import { useGetChats } from "@/hooks/useChats";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [prompt, setPrompt] = useState<string>("")
  const {chats, setChats} = useGetChats()
  const createChat = async(e) =>{
    try{
      if("key" in e && e.key == "Enter"){
          const newChat = {
        id: chats.length + 1,
        title: prompt,
        createdAt: Date.now().toString(),
        messages: [
          {
            id: 1,
            owner: "you",
            message: prompt,
            timestamp: Date.now().toString(),
          },
        ],
      }
        setChats((prevItems) =>[
          newChat,
          ...prevItems
        ])
        router.push(`/${newChat.id}`)
      }
      if(e._reactName == "onClick"){
            const newChat = {
        id: chats.length + 1,
        title: prompt,
        createdAt: Date.now().toString(),
        messages: [
          {
            id: 1,
            owner: "you",
            message: prompt,
            timestamp: Date.now().toString(),
          },
        ],
      }
        setChats((prevItems) =>[
          newChat,
          ...prevItems
        ])
        router.push(`/${newChat.id}`)
      }
    }catch(e){
      console.error("Ocurrio un error: ", e)
    }
  }

 
  return (
    <main className=" flex flex-col h-screen ">
      {/* Contenido centrado */}
      <div className="flex flex-1 justify-center items-center">
        <h1 className="font-mono font-semibold text-4xl text-white text-center">
          ¿Qué deseas consultarme? :)
        </h1>
      </div>

      {/* Input abajo */}
      <section className="flex items-center bg-gray-800 border-t border-gray-600 p-2">
        <Input
          onKeyDown={(e) => createChat(e)}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 border-none focus-visible:ring-0 font-mono text-white bg-gray-700"
          placeholder="Escribe tu mensaje..."
        />
        <Button
          onClick={(e) => createChat(e)}
          disabled={prompt.length === 0}
          className="hover:cursor-pointer bg-gray-700 ml-2"
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
