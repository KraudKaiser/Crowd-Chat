"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {  Plus,  } from "lucide-react"
import React, { useState } from "react"
import Dropdown from "./DropdownMenu"
import { Input } from "../ui/input"
import { useGetChats } from "@/hooks/useChats"
import Link from "next/link"
export default function SidebarComponent() {
  const {chats, setChats, loading} = useGetChats()

  const changeItemName = ({e,id, newName, setOnChange} : {e:React.KeyboardEvent,id:string, newName:string, setOnChange:React.Dispatch<React.SetStateAction<boolean>>}) =>{
      if(e.key === "Enter"){
        setOnChange(false)
        setChats((prev) =>
          prev.map((chat) => chat.id === id ? {...chat, title:newName} : chat))
      }
  
  }

  const deleteItem = (id : string) =>{
    setChats((prev) =>{
      const newChats = prev.filter((chat) => chat.id !== id)
      return newChats
    })
  }

  const ChatItem = ({item} : {item:{id:string, title:string}}) => {
    const [name, setName] = useState<string>(item.title)
    const [onChange, setOnChange] = useState<boolean>(false)
    return (
      <Link href={`/${item.id}`}
        className="flex justify-between rounded-sm text-left px-3 py-2   hover:bg-gray-700 hover:cursor-pointer text-sm text-gray-200 transition-colors"
      >
        {
          onChange ? 
          (
            <Input value={name} onKeyDown={(e) => changeItemName({e, id:item.id, newName:name, setOnChange})} onChange={(e) => setName(e.target.value)}></Input>
          )
          :
          (
            <h1 className="text-white">{item.title}</h1>
          )
        }
        <Dropdown deleteItem={() => deleteItem(item.id)} setOnChange={() => setOnChange(!onChange)} />

      </Link>
    )
  }


  return (
    <Sidebar className="">
      {/* Header con botón */}
      <SidebarHeader className="bg-gray-800">
        <Link href={"/"}  className="flex items-center gap-2 rounded-md p-2
        text-white bg-gray-700 hover:bg-gray-600 hover:text-white hover:cursor-pointer 
        transition-colors
         ">
          <Plus className="w-4 h-4" />
          Crear nuevo chat
        </Link>
      </SidebarHeader>

      {/* Scrollable chats */}
      <SidebarContent className="overflow-hidden flex-1 bg-gray-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-md text-white">
            Tu historial de chats
          </SidebarGroupLabel>

          {/* ScrollArea envolviendo la lista */}
          <ScrollArea className="h-[400px] pr-2">
            <SidebarGroupContent className="flex flex-col gap-2 p-2">
              {!loading && chats.reverse().map((item) => (
                <ChatItem key={item.id} item={item} />
              ))}
            </SidebarGroupContent>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}

    </Sidebar>
  )
}
