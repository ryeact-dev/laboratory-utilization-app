import { Moon, Sun } from "lucide-react";

export default function ThemeToggler({ onSetThemeHandler, currentTheme }) {
  return currentTheme === "dracula" ? (
    <button
      data-set-theme="autumn"
      data-act-class="ACTIVECLASS"
      className="btn btn-circle btn-ghost transition duration-500 ease-in-out"
      onClick={() => onSetThemeHandler("autumn")}
    >
      <Sun className={"h-6 w-6 fill-current"} />
    </button>
  ) : (
    <button
      data-set-theme="dracula"
      data-act-class="ACTIVECLASS"
      className="btn btn-circle btn-ghost transition duration-500 ease-in-out"
      onClick={() => onSetThemeHandler("dracula")}
    >
      <Moon className={"h-6 w-6 fill-current"} />
    </button>
  );
}
