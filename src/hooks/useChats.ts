"use client"
import { Chats } from "@/types/chats"
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

