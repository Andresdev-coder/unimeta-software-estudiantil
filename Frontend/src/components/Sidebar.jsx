import { NavLink } from "react-router-dom";
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

const links = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/estudiantes", icon: Users, label: "Estudiantes" },
  { to: "/cursos", icon: BookOpen, label: "Cursos" },
  { to: "/materias", icon: Layers, label: "Materias" },
  { to: "/matriculas", icon: ClipboardList, label: "Matrículas" },
  { to: "/ingresos", icon: DollarSign, label: "Ingresos" },
  { to: "/configuracion", icon: Settings, label: "Configuración" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col items-center w-20 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 py-6 gap-2">
      <div className="mb-6 p-2.5 rounded-xl bg-blue-700 text-white">
        <GraduationCap size={22} />
      </div>

      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          title={label}
          className={({ isActive }) =>
            `p-3 rounded-xl transition-colors ${
              isActive
                ? "bg-blue-50 text-blue-700"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`
          }
        >
          <Icon size={20} />
        </NavLink>
      ))}
    </aside>
  );
}
