import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutGrid,
  Users,
  BookOpen,
  Layers,
  ClipboardList,
  DollarSign,
  GraduationCap,
  Settings,
} from "lucide-react";

const enlacesAdmin = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/estudiantes", icon: Users, label: "Estudiantes" },
  { to: "/cursos", icon: BookOpen, label: "Cursos" },
  { to: "/materias", icon: Layers, label: "Materias" },
  { to: "/matriculas", icon: ClipboardList, label: "Matrículas" },
  { to: "/ingresos", icon: DollarSign, label: "Ingresos" },
  { to: "/configuracion", icon: Settings, label: "Configuración" },
];

const enlacesRol = {
  PROFESOR: [{ to: "/profesor", icon: BookOpen, label: "Espacio del profesor" }],
  ESTUDIANTE: [{ to: "/estudiante", icon: GraduationCap, label: "Mi espacio académico" }],
};

export default function Sidebar() {
  const { usuario } = useAuth();
  const links = enlacesRol[usuario?.rol] || enlacesAdmin;
  const navLinks = (mobile = false) => links.map(({ to, icon: Icon, label }) => (
    <NavLink
      key={to}
      to={to}
      title={label}
      aria-label={label}
      className={({ isActive }) =>
        `${mobile ? "flex min-w-[68px] flex-col items-center gap-1 px-2 py-2" : "p-3"} rounded-xl transition-colors ${
          isActive
            ? "bg-blue-50 text-blue-700 dark:bg-slate-700 dark:text-blue-300"
            : "text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:hover:bg-slate-700"
        }`
      }
    >
      <Icon size={20} />
      {mobile && <span className="max-w-[68px] truncate text-[10px] leading-tight">{label}</span>}
    </NavLink>
  ));

  return (
    <>
    <aside className="hidden md:flex flex-col items-center w-20 shrink-0 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 py-6 gap-2">
      <div className="mb-6 p-2.5 rounded-xl bg-blue-700 text-white">
        <GraduationCap size={22} />
      </div>
      {navLinks()}
    </aside>
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-1 overflow-x-auto border-t border-slate-200 bg-white/95 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur dark:border-slate-700 dark:bg-slate-800/95 md:hidden">
      {navLinks(true)}
    </nav>
    </>
  );
}
