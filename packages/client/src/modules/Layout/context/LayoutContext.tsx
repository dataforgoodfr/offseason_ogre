import React from "react";
import { useState } from "react";

export { LayoutProvider, useLayoutContext };

interface State {
  isDrawerOpen: boolean;
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutContext = React.createContext<State | undefined>(undefined);

function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);

  const value = {
    isDrawerOpen,
    setIsDrawerOpen,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
}

function useLayoutContext(): State {
  const context = React.useContext(LayoutContext);

  if (context === undefined) {
    throw new Error(
      "useLayoutContext must be used within a LayoutContextProvider"
    );
  }

  return context;
}
