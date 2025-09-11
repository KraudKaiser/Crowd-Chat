"use client"

import ChatHistorial from "@/components/chat/ChatHistorial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetChats } from "@/hooks/useChats";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { SendHorizontal } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ChatPage() {
  const { id } = useParams()
  const getChat = useGetChats()
  const [chat, setChat] = useState([])
  const [prompt, setPrompt] = useState("")


  const addMessage = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {

    //Tipado para cuando se aprieta enter
    if ("key" in e && e.key === "Enter") {
      setChat((prev) => [
        ...prev,
        {
          owner: "You",
          message: prompt
        }
      ])
      setPrompt("")
    }
    //Tipado para cuando se hace click
    if ("_reactName" in e && e._reactName === "onClick") {
      setChat((prev) => [
        ...prev,
        {
          owner: "You",
          message: prompt
        }
      ])
      setPrompt("")
    }
  }

  return (
    <main className="flex flex-col h-screen bg-gray-900">
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <ScrollArea className="w-full h-full">
          <ChatHistorial chat={getChat[parseInt(id)]} />
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