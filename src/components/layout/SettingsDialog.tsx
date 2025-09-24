"use client";

import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { SettingsContextType, useSettings } from "@/context/SettingsContext";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

function ModelSelect({ settings, updateSettings }: SettingsContextType) {

    function changeModelSetting(value:"gpt-4o-mini" | "gpt-3.5-turbo"){
        updateSettings({
            model:value
        })
    }
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="flex items-center justify-between gap-4">
      <h2>Selecciona el Modelo de IA</h2>
      <Tooltip >
        <TooltipTrigger className="">
            <Button className="bg-gray-900  rounded-full" variant={"outline"}>
            ?
            </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-800 text-white text-sm p-2 rounded-md shadow-md">
            Permite que utilices el modelo de lenguaje de tu eleccion.
        </TooltipContent>
      </Tooltip>
      </span>

      <ToggleGroup
        onValueChange={changeModelSetting}
        defaultValue={settings.model}
        size={"lg"}
        className=" bg-gray-800"
        type="single"
      >
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"gpt-4o-mini"}
        >
          Chat GPT 4o Mini
        </ToggleGroupItem>
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"gpt-3.5-turbo"}
        >
          Chat GPT 3.5 Turbo
        </ToggleGroupItem>
        
      </ToggleGroup>
    </div>
  );
}

function TokensToggle({ settings, updateSettings }: SettingsContextType) {
  const changeTokensSetting = (value: string) => {
    updateSettings({
      maxTokens: parseInt(value),
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
     <span className="flex items-center justify-between gap-4">
      <h2>Selecciona el limite de Tokens</h2>
      <Tooltip >
        <TooltipTrigger className="">
            <Button className="bg-gray-900  rounded-full" variant={"outline"}>
            ?
            </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-800 text-white text-sm p-2 rounded-md shadow-md">
            Pone un limite a la cantidad de Tokens Maximos por peticion que hagas
        </TooltipContent>
      </Tooltip>
      </span>
      <ToggleGroup
        onValueChange={changeTokensSetting}
        defaultValue={settings.maxTokens.toString()}
        size={"lg"}
        className=" bg-gray-800"
        type="single"
      >
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"300"}
        >
          300
        </ToggleGroupItem>
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"600"}
        >
          600
        </ToggleGroupItem>
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"900"}
        >
          900
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

function HistorialToggle({ settings, updateSettings }: SettingsContextType) {
  const changeHistorialSetting = (value: string) => {
    updateSettings({
      includeHistory: parseInt(value),
    });
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="flex items-center justify-between gap-4">
      <h2>Historial maximo para el Contexto</h2>
      <Tooltip >
        <TooltipTrigger className="">
            <Button className="bg-gray-900  rounded-full" variant={"outline"}>
            ?
            </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-gray-800 text-white text-sm p-2 rounded-md shadow-md">
            Pone un limite a la cantidad de mensajes que puede recordar la Inteligencia Artificial en el Chat
        </TooltipContent>
      </Tooltip>
      </span>
      <ToggleGroup
        onValueChange={changeHistorialSetting}
        defaultValue={settings.includeHistory.toString()}
        size={"lg"}
        className=" bg-gray-800"
        type="single"
      >
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"5"}
        >
          5
        </ToggleGroupItem>
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"10"}
        >
          10
        </ToggleGroupItem>
        <ToggleGroupItem
          className="hover:text-white hover:bg-gray-900 hover:cursor-pointer"
          value={"20"}
        >
          20
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export default function SettingsDialog() {
  const { settings, updateSettings } = useSettings();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="hover:cursor-pointer hover:bg-gray-900 transition-colors ease-in-out duration-200"
        >
          <Settings className="text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-700 border-gray-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Configuraciones</DialogTitle>
          <DialogDescription className="text-white">
            Ajusta la apariencia y opciones de la aplicación.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4 text-white">
          <ModelSelect settings={settings} updateSettings={updateSettings} />
          <TokensToggle settings={settings} updateSettings={updateSettings} />
          <HistorialToggle
            settings={settings}
            updateSettings={updateSettings}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
