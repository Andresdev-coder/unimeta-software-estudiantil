import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export default function LiveClock() {
  const [ahora, setAhora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  const hora = ahora.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const fecha = ahora.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-blue-50 text-blue-700">
        <Clock size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">{hora}</p>
        <p className="text-xs text-slate-400 capitalize">{fecha}</p>
      </div>
    </div>
  );
}
