export default function AveragesCard({ resumen }) {
  const promedioEstudiantes =
    resumen.totalCursos > 0
      ? (resumen.totalEstudiantes / resumen.totalCursos).toFixed(1)
      : "0";
  const promedioMaterias =
    resumen.totalCursos > 0
      ? (resumen.totalMaterias / resumen.totalCursos).toFixed(1)
      : "0";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">
      <p className="font-semibold text-slate-700 dark:text-slate-100 mb-4">Promedios por curso</p>

      <div className="mb-5">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-500 dark:text-slate-300">Estudiantes por curso</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">
            {promedioEstudiantes}
          </span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{ width: `${Math.min(promedioEstudiantes * 10, 100)}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-500 dark:text-slate-300">Materias por curso</span>
          <span className="font-medium text-slate-700 dark:text-slate-100">{promedioMaterias}</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-600 rounded-full"
            style={{ width: `${Math.min(promedioMaterias * 20, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
