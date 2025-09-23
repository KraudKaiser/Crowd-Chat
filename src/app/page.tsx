"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";

import { useGetChats } from "@/hooks/useChats";
import { useRouter } from "next/navigation";
import { ProcessStream, processStreamNewChat } from "@/lib/ProcessStream";
import { useSettings } from "@/context/SettingsContext";

export default function Home() {
  const router = useRouter()
  const [prompt, setPrompt] = useState<string>("")
  const {setChats} = useGetChats()
  const {settings} = useSettings()
  
  const createChat = async(e : React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) =>{
    try{
      if (("key" in e && e.key !== "Enter") && !("_reactName" in e && e._reactName === "onClick")) return
        
      
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: prompt,
          message: prompt,
          model:settings.model,
          tokens:settings.maxTokens,
        }),
      })


      const newChat = await res
      
      const newchatid = await processStreamNewChat(prompt,newChat, setChats)

      // Redirigir al nuevo chat
      router.push(`/${newchatid}`)
     
      
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
          className="flex-1 border-none focus-visible:ring-0 font-mono text-white bg-gray-700 placeholder:text-white"
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
