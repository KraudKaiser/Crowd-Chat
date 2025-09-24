"use client";

import { Settings, SettingsContextType } from "@/types/settings";
import { createContext, useContext, useState, ReactNode } from "react";


const defaultSettings: Settings = {
    model:"gpt-4o-mini",
  maxTokens: 300,
  includeHistory: 10,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(()=>{
    const stored = localStorage.getItem("settings")
    return stored ? JSON.parse(stored) : defaultSettings
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("settings", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings debe usarse dentro de un SettingsProvider");
  }
  return context;
}
