export type Settings = {
    model:"gpt-4o-mini" | "gpt-3.5-turbo"
  maxTokens: number
  includeHistory: number
};

export type SettingsContextType = {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
};
