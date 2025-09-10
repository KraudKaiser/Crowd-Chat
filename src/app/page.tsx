"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [chat, setChat] = useState([])
  return (
    <div className="flex flex-col justify-between h-dvh">
      <div className="flex items-center justify-center h-full ">
        {chat.length == 0 && (
          <h1 className="text-4xl font-mono text-white">¿Que quieres pedirme hoy?</h1>
        )}
      </div>
    <Input className="border-gray-500 border-1 bg-gray-800">
    
    </Input>
    </div>
  );
}
