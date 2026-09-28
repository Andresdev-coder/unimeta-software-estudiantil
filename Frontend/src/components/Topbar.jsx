import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ title }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex min-w-0 items-center justify-between gap-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 py-3 sm:px-6 sm:py-4">
      <h1 className="min-w-0 truncate text-base font-semibold text-slate-800 dark:text-slate-100 sm:text-lg">
        {title}
      </h1>

      <div className="flex shrink-0 items-center gap-1 sm:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-3 py-2 rounded-lg w-64">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-sm outline-none w-full text-slate-700 dark:text-slate-100"
          />
        </div>

        <button aria-label="Notificaciones" className="relative hidden p-2 rounded-lg hover:bg-slate-50 text-slate-500 sm:block">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-semibold">
            {usuario?.username?.[0]?.toUpperCase()}
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-slate-700 leading-tight">
              {usuario?.username}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {usuario?.rol}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
