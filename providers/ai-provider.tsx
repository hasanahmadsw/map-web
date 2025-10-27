"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

interface AiContextType {
  isAiAvailable: boolean;
  setIsAiAvailable: (available: boolean) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const AiContext = createContext<AiContextType | undefined>(undefined);

export function AiProvider({ children }: { children: ReactNode }) {
  const [isAiAvailable, setIsAiAvailable] = useState(true); // Set to true for now
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <AiContext.Provider
      value={{
        isAiAvailable,
        setIsAiAvailable,
        isProcessing,
        setIsProcessing,
      }}
    >
      {children}
    </AiContext.Provider>
  );
}

export function useAi() {
  const context = useContext(AiContext);
  if (context === undefined) {
    throw new Error("useAi must be used within an AiProvider");
  }
  return context;
}
