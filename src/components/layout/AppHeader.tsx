"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import CrowdLogo from "@/assets/raven.svg"
import SettingsDialog from "./SettingsDialog";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2 gap-2 border-gray-900 border-b bg-gray-800 shadow-sm">
      {/* Botón para abrir/cerrar sidebar */}
      <SidebarTrigger className="text-white hover:cursor-pointer" />
      <span className="w-52 flex items-center justify-between">
        <Image className="w-16" src={CrowdLogo} alt="logo" ></Image>
        <h1 className="text-lg font-semibold font-mono text-white">
            Crowd Chat
        </h1>
      </span>

      {/* Botón de Configuración */}
      <SettingsDialog />
    </header>
  );
}
