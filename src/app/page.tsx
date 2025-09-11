"use client"
import ChatHistorial from "@/components/chat/ChatHistorial";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { SendHorizontal } from "lucide-react";
import { useState } from "react";

const example = [
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },
  {
    owner: "you",
    message: "I want you to write a lorem ipsum dolorem"
  },
  {
    owner: "bot",
    message: "Yes, here is a lorem ipsum:"
  },

]

export default function Home() {
  const [chat, setChat] = useState(example)
  const [prompt, setPrompt] = useState<string>("")

  const addMessage = (e : React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) =>{
      
    //Tipado para cuando se aprieta enter
    if("key" in e && e.key === "Enter"){
        setChat((prev) =>[
          ...prev,
          {
            owner:"You",
            message:prompt
          }
        ])
        setPrompt("")
      }
      //Tipado para cuando se hace click
      if ("_reactName" in e && e._reactName === "onClick"){
        setChat((prev) =>[
          ...prev,
          {
            owner:"You",
            message:prompt
          }
        ])
        setPrompt("")
      }
  }
  return (
    <main className="flex flex-col justify-between ">
      <ScrollArea>
     <ChatHistorial chat={chat} />
      </ScrollArea>
      <section className="sticky bottom-0 flex bg-gray-800 border-1 border-gray-600 rounded-md p-1">
          <Input onKeyDown={(e) => addMessage(e)} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="border-none focus-visible:ring-0
          font-mono text-white
          "></Input>
          <Button onClick={(e) => addMessage(e)} disabled={prompt.length == 0}  className={`bg-gray-800 `}>
            <SendHorizontal className={`${prompt.length == 0 ? "opacity-0" : "opacity-100"} transition-opacity ease-in-out duration-200`}/>
          </Button>
      </section>
    </main>
  );
}
