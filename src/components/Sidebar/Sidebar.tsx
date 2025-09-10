"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Plus, Trash } from "lucide-react"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu"

export default function SidebarComponent() {
    const [chats, setChats] = useState([{
        id:1,
        title:"hola"
    }])
    const addItem = () => {
        setChats((prevItems) => [
            {
            id: prevItems.length + 1,
            title: `chat numero ${prevItems.length + 1}`,
            },
            ...prevItems,
        ])
}

    const ChatItem = ({item}) =>{
        return(
            <span
                  className="flex justify-between bg-red-500 text-left px-3 py-2   hover:bg-gray-700 hover:cursor-pointer text-sm text-gray-200 transition-colors"
                >
                  <h1 className="text-white">{item.title}</h1>  
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button>...</button>
                    </DropdownMenuTrigger>
                     <DropdownMenuContent className="bg-gray-800 text-white w-56" align="start">
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuGroup>
                        <DropdownMenuItem className="text-xs">
                            <Edit />
                            Cambiar Nombre de Chat
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-xs text-red-400">
                            <Trash color="red"/>
                            Eliminar Chat
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            </span>
        )
    }


  return (
    <Sidebar className="hover:cursor-pointer">
      {/* Header con botón */}
      <SidebarHeader className="bg-gray-800">
        <SidebarMenuButton onClick={addItem} className="bg-gray-700 hover:bg-gray-600 transition-colors text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Crear nuevo chat
        </SidebarMenuButton>
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
              {chats.reverse().map((item) => (
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
