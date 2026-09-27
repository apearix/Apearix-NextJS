"use client";
import { createContext, useContext, useState } from "react";

type Settings = Record<string, any>;

const MasterSettingsContext = createContext<{
  masterSettings: Settings | null;
  setMasterSettings: (s: Settings) => void;
}>({
  masterSettings: null,
  setMasterSettings: () => {},
});

export function MasterSettingsProvider({ children }: { children: React.ReactNode }) {
  const [masterSettings, setMasterSettings] = useState<Settings | null>(null);

  return (
    <MasterSettingsContext.Provider value={{ masterSettings, setMasterSettings }}>
      {children}
    </MasterSettingsContext.Provider>
  );
}

export function useMasterSettings() {
  return useContext(MasterSettingsContext);
}
