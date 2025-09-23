"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type Settings = {
    model:"gpt-4o-mini" | "gpt-3.5-turbo"
  maxTokens: number
  includeHistory: number
};

export type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};

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
