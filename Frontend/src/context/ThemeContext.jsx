import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem("tema") === "oscuro";
  });

  useEffect(() => {
    const raiz = document.documentElement;
    if (modoOscuro) {
      raiz.classList.add("dark");
      localStorage.setItem("tema", "oscuro");
    } else {
      raiz.classList.remove("dark");
      localStorage.setItem("tema", "claro");
    }
  }, [modoOscuro]);

  const alternarTema = () => setModoOscuro((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ modoOscuro, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
