import { useTheme } from "next-themes";
import { type Action, useRegisterActions } from "kbar";

export const useThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const themeActions: Action[] = [
    {
      id: "toggleTheme",
      name: "Toggle theme",
      shortcut: ["t"],
      section: "Theme",
      perform: toggleTheme,
    },
    {
      id: "setLightTheme",
      name: "Set light theme",
      section: "Theme",
      perform: () => setTheme("light"),
    },
    {
      id: "setDarkTheme",
      name: "Set dark theme",
      section: "Theme",
      perform: () => setTheme("dark"),
    },
  ];

  useRegisterActions(themeActions, [theme]);
};
