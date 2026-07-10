"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

const iconBtnCls =
  "relative flex h-9 w-9 items-center justify-center rounded-lg border-none bg-transparent text-[#555] transition-colors duration-150 hover:bg-[#f5f5f5] hover:text-[#0f172a] dark:text-[#aaa] dark:hover:bg-[#101a2c] dark:hover:text-white";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={iconBtnCls}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
