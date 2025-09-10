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
import { Plus } from "lucide-react"

const items = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  title: `Chat número ${i + 1}`,
}))

export default function SidebarComponent() {
  return (
    <Sidebar className="hover:cursor-pointer">
      {/* Header con botón */}
      <SidebarHeader className="bg-gray-800">
        <SidebarMenuButton className="bg-gray-700 hover:bg-gray-600 transition-colors text-white flex items-center gap-2">
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
            <SidebarGroupContent className="flex flex-col gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  className="w-full text-left px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-sm text-gray-200 transition-colors"
                >
                  {item.title}
                </button>
              ))}
            </SidebarGroupContent>
          </ScrollArea>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      
    </Sidebar>
  )
}
