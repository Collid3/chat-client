import { createContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("chat-theme") || "light"
  );

  const updateTheme = (themeName) => {
    localStorage.setItem("chat-theme", themeName);
    setTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
