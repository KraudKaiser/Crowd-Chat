"use client"

import conversation from "@/Json/conversation.json"
import { Chats } from "@/types/chats"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export const useGetChats = () => {
  const [chats, setChats] = useState<Chats>([])
  const  [loading, setLoading] = useState(false)
  useEffect(() =>{
    setLoading(true)
    const stored = localStorage.getItem("chats")
    if(stored){
      setChats(JSON.parse(stored))
      setLoading(false)
    }else{
      setChats(conversation.chats)
      localStorage.setItem("chats", JSON.stringify(conversation.chats))
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    setLoading(true)
    if(chats.length > 0){
      localStorage.setItem("chats", JSON.stringify(chats))
      setLoading(false)
    }
  },[chats])
  
  return {chats, setChats, loading}
}

