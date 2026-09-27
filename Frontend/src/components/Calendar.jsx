import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function Calendar() {
  const hoy = new Date();
  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());

  const primerDiaSemana = new Date(anioActual, mesActual, 1).getDay();
  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();

  const celdas = [];
  for (let i = 0; i < primerDiaSemana; i++) celdas.push(null);
  for (let d = 1; d <= diasEnMes; d++) celdas.push(d);

  const cambiarMes = (delta) => {
    let m = mesActual + delta;
    let a = anioActual;
    if (m < 0) {
      m = 11;
      a -= 1;
    }
    if (m > 11) {
      m = 0;
      a += 1;
    }
    setMesActual(m);
    setAnioActual(a);
  };

  const esHoy = (dia) =>
    dia === hoy.getDate() &&
    mesActual === hoy.getMonth() &&
    anioActual === hoy.getFullYear();

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-slate-700 dark:text-slate-100">
          {MESES[mesActual]} {anioActual}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() => cambiarMes(-1)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => cambiarMes(1)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 dark:text-slate-500 mb-2">
        {DIAS.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {celdas.map((dia, i) => (
          <span
            key={i}
            className={`py-1.5 rounded-lg ${
              dia === null
                ? ""
                : esHoy(dia)
                  ? "bg-blue-700 text-white font-semibold"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {dia || ""}
          </span>
        ))}
      </div>
    </div>
  );
}
