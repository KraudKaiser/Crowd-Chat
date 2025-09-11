import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Edit, Trash } from "lucide-react"

export default function Dropdown({deleteItem, setOnChange} : {deleteItem:VoidFunction, setOnChange:VoidFunction}){
    return(
        <DropdownMenu>
                    <DropdownMenuTrigger  asChild>
                        <button className="w-[20px] hover:bg-gray-500 rounded-md 
                        transition-colors ease-in-out duration-200
                        focus-visible:outline-none
                        hover:cursor-pointer">...</button>
                    </DropdownMenuTrigger>
                     <DropdownMenuContent className="bg-gray-800 text-white w-56" align="start">
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuGroup>
                        <DropdownMenuItem className="text-xs" onClick={setOnChange}>
                            <Edit />
                            Cambiar Nombre de Chat
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={deleteItem} className="text-xs text-red-400">
                            <Trash color="red"/>
                            Eliminar Chat
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        </DropdownMenuGroup>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
    )
}