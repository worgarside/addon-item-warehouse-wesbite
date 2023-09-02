"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookie from "js-cookie";
interface SettingsContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  showTooltip: boolean;
  toggleShowTooltip: () => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(
  undefined,
);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(
    Cookie.get("darkMode") === "1" || false,
  );

  const toggleDarkMode = useCallback(() => setDarkMode(!darkMode), [darkMode]);

  useEffect(() => {
    Cookie.set("darkMode", darkMode ? "1" : "0");
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light",
    );
  }, [darkMode]);

  const [showTooltip, setShowTooltip] = useState<boolean>(
    Cookie.get("showTooltip") === "1" || false,
  );

  const toggleShowTooltip = useCallback(
    () => setShowTooltip(!showTooltip),
    [showTooltip],
  );

  useEffect(() => {
    Cookie.set("showTooltip", showTooltip ? "1" : "0");
  });

  useEffect(() => {
    const initialDarkMode = Cookie.get("darkMode") === "1";
    const initialShowTooltip = Cookie.get("showTooltip") === "1";

    setDarkMode(initialDarkMode);
    setShowTooltip(initialShowTooltip);
  }, []);

  const value = useMemo(
    () => ({ darkMode, showTooltip, toggleDarkMode, toggleShowTooltip }),
    [darkMode, showTooltip, toggleDarkMode, toggleShowTooltip],
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
