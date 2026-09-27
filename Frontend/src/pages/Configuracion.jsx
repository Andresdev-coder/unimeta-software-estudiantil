import { Moon, Sun } from "lucide-react";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";

export default function Configuracion() {
  const { modoOscuro, alternarTema } = useTheme();

  return (
    <Layout title="Configuración">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 max-w-md">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">
          Apariencia
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
              {modoOscuro ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                Modo oscuro
              </p>
              <p className="text-xs text-slate-400">
                Cambia el estilo de toda la interfaz
              </p>
            </div>
          </div>

          <button
            onClick={alternarTema}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              modoOscuro ? "bg-blue-700" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                modoOscuro ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </Layout>
  );
}
