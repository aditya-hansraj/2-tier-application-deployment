// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    } else {
      setDarkMode(false);
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {  
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

