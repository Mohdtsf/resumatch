"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     
    const setupTheme = () => {
      // Check system preference or saved preference
      const saved = localStorage.getItem("resumatch-theme") as Theme | null;
      if (saved) {
         
        setTheme(saved);
        document.documentElement.classList.toggle("dark", saved === "dark");
      } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
         
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
       
      setMounted(true);
    };
    setupTheme();
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("resumatch-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // Prevent flash of wrong theme
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
