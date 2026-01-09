"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { DemoConfig } from "@/types/demo-config";
import { createDefaultDemoConfig } from "@/types/demo-config";

interface DemoContextValue {
  config: DemoConfig;
  updateConfig: (updates: Partial<DemoConfig>) => void;
  resetConfig: () => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

interface DemoProviderProps {
  children: ReactNode;
  initialConfig?: Partial<DemoConfig>;
}

export function DemoProvider({ children, initialConfig }: DemoProviderProps) {
  const [config, setConfig] = useState<DemoConfig>(() =>
    createDefaultDemoConfig(initialConfig)
  );

  const updateConfig = useCallback((updates: Partial<DemoConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(createDefaultDemoConfig(initialConfig));
  }, [initialConfig]);

  return (
    <DemoContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoConfig(): DemoContextValue {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error("useDemoConfig must be used within a DemoProvider");
  }
  return context;
}
