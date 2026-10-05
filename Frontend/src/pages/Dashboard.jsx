import { useEffect, useState } from "react";
import { Users, BookOpen, Layers, DollarSign } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../services/api";
import Layout from "../components/Layout";
import GradientStatCard from "../components/GradientStatCard";
import LiveClock from "../components/LiveClock";
import Calendar from "../components/Calendar";
import AveragesCard from "../components/AveragesCard";
import { toast } from "react-toastify";

const COLORES_DONUT = ["#10b981", "#f59e0b"];

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cargarDashboard = async () => {
      try {
        const response = await api.get("/api/dashboard");
        setResumen(response.data);
      } catch (err) {
        toast.error("No se pudo cargar el dashboard");
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    cargarDashboard();
  }, []);

  if (cargando) {
    return (
      <Layout title="Dashboard">
        <p className="text-gray-500">Cargando...</p>
      </Layout>
    );
  }

  if (error || !resumen) {
    return (
      <Layout title="Dashboard">
        <p className="text-red-500">
          No se pudo cargar la información del dashboard.
        </p>
      </Layout>
    );
  }

  const dataDonut = [
    { name: "Pagados", value: Number(resumen.ingresosPagados) || 0 },
    { name: "Pendientes", value: Number(resumen.ingresosPendientes) || 0 },
  ];
  const totalDonut = dataDonut[0].value + dataDonut[1].value;

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <GradientStatCard
          icon={Users}
          label="Estudiantes"
          value={resumen.totalEstudiantes}
          gradient="bg-gradient-to-br from-sky-400 to-blue-600"
        />
        <GradientStatCard
          icon={BookOpen}
          label="Cursos"
          value={resumen.totalCursos}
          gradient="bg-gradient-to-br from-emerald-400 to-teal-600"
        />
        <GradientStatCard
          icon={Layers}
          label="Materias"
          value={resumen.totalMaterias}
          gradient="bg-gradient-to-br from-violet-500 to-purple-700"
        />
        <GradientStatCard
          icon={DollarSign}
          label="Ingresos pagados"
          value={`$${Number(resumen.ingresosPagados).toLocaleString("es-CO")}`}
          gradient="bg-gradient-to-br from-amber-400 to-orange-600"
        />
      </div>

      {/* Gráfica de área + reloj/calendario */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="min-w-0 lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">
            Ingresos por semana
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={resumen.ingresosPorSemana}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E74B5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2E74B5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" />
              <XAxis dataKey="semana" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "0.75rem", color: "#f8fafc" }}
                formatter={(value) =>
                  `$${Number(value).toLocaleString("es-CO")}`
                }
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#2E74B5"
                strokeWidth={3}
                fill="url(#colorIngresos)"
                dot={{ r: 5, fill: "#2E74B5", strokeWidth: 0 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-4">
          <LiveClock />
          <Calendar />
        </div>
      </div>

      {/* Donut + promedios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="min-w-0 bg-white dark:bg-slate-800 rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">
            Ingresos: pagados vs pendientes
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={dataDonut}
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {dataDonut.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORES_DONUT[index % COLORES_DONUT.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "0.75rem", color: "#f8fafc" }}
                formatter={(value) =>
                  `$${Number(value).toLocaleString("es-CO")}`
                }
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-2">
            {dataDonut.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-sm">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORES_DONUT[i] }}
                />
                <span className="text-slate-500 dark:text-slate-300">{d.name}</span>
                <span className="font-medium text-slate-700 dark:text-slate-100">
                  {totalDonut > 0
                    ? Math.round((d.value / totalDonut) * 100)
                    : 0}
                  %
                </span>
              </div>
            ))}
          </div>
        </div>

        <AveragesCard resumen={resumen} />
      </div>
    </Layout>
  );
}
