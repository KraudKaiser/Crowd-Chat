"use client"

import ChatHistorial from "@/components/chat/ChatHistorial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetChats } from "@/hooks/useChats";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SendHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const { id } = useParams()
  const {chats, setChats, loading} = useGetChats()
  const [indexWanted, setIndexWanted] = useState<number | null>(null)
  const [prompt, setPrompt] = useState("")
  

  useEffect(()=>{
    if(!loading){
      setIndexWanted(chats.findIndex((chat) => chat.id === Number(id)))
    }
  },[loading])

  const addMessage = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {

    //Tipado para cuando se aprieta enter
    if ("key" in e && e.key === "Enter") {
       const newMessage = {
            id: 1,
            owner: "you",
            message: prompt,
            timestamp: Date.now().toString(),
          
      }
      setChats((prev) =>
        prev.map((c, i) =>
          i === indexWanted
            ? { ...c, messages: [...c.messages, newMessage] }
            : c
        )
      )
      setPrompt("")
    }
    //Tipado para cuando se hace click
    if ("_reactName" in e && e._reactName === "onClick") {
      const newMessage = {
            id: 1,
            owner: "you",
            message: prompt,
            timestamp: Date.now().toString(),
          
      }
     setChats((prev) =>
        prev.map((c, i) =>
          i === indexWanted
            ? { ...c, messages: [...c.messages, newMessage] }
            : c
        )
      )
      setPrompt("")
    }
  }
  if(loading){
    return(<main className="flex flex-col h-screen bg-gray-900">
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
  return (
      <main className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex justify-center items-center overflow-hidden">
      <ScrollArea className="w-full h-full">
        <ChatHistorial chat={chats[indexWanted]} />
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