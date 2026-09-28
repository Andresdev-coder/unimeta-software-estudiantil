import { useEffect, useState } from "react";
import { Check, DollarSign, Plus, Search } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import {
  registrarIngreso,
  historialPorEstudiante,
  actualizarEstadoIngreso,
} from "../services/ingresosService";
import { listarMatriculas } from "../services/matriculasService";
import { listarEstudiantes } from "../services/estudiantesService";

export default function Ingresos() {
  const [matriculas, setMatriculas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [formAbierto, setFormAbierto] = useState(false);
  const [matriculaId, setMatriculaId] = useState("");
  const [monto, setMonto] = useState("");
  const [estado, setEstado] = useState("PAGADO");

  const [estudianteFiltro, setEstudianteFiltro] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [ingresos, setIngresos] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const cargarBase = async () => {
      try {
        const [matriculasData, estudiantesData] = await Promise.all([
          listarMatriculas(),
          listarEstudiantes(),
        ]);
        setMatriculas(matriculasData);
        setEstudiantes(estudiantesData);
      } catch (err) {
        toast.error("No se pudieron cargar los datos base");
      }
    };
    cargarBase();
  }, []);

  const handleRegistrar = async (e) => {
    e.preventDefault();
    if (!matriculaId || !monto)
      return toast.error("Completa matrícula y monto");
    try {
      await registrarIngreso({
        matriculaId: Number(matriculaId),
        monto: Number(monto),
        estado,
      });
      toast.success("Ingreso registrado");
      setMatriculaId("");
      setMonto("");
      setFormAbierto(false);
      if (estudianteFiltro) handleConsultar();
    } catch (err) {
      toast.error("Error al registrar el ingreso");
    }
  };

  const handleMarcarPagado = async (id) => {
    try {
      await actualizarEstadoIngreso(id, "PAGADO");
      toast.success("Ingreso marcado como pagado");
      handleConsultar();
    } catch (err) {
      toast.error("Error al actualizar el ingreso");
    }
  };

  const handleConsultar = async (e) => {
    if (e) e.preventDefault();
    if (!estudianteFiltro) return toast.error("Selecciona un estudiante");
    setCargando(true);
    try {
      const data = await historialPorEstudiante(estudianteFiltro, desde, hasta);
      setIngresos(data);
    } catch (err) {
      toast.error("Error al consultar el historial");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Layout title="Ingresos">
      <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500 dark:text-slate-300 text-sm">Registro y consulta de pagos</p>
        <button
          onClick={() => setFormAbierto(!formAbierto)}
          className="flex w-full items-center justify-center gap-1 whitespace-nowrap bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg transition-colors sm:w-auto"
        >
          <Plus size={16} /> Registrar ingreso
        </button>
      </div>

      {formAbierto && (
        <form
          onSubmit={handleRegistrar}
          className="mb-6 flex flex-col items-stretch gap-3 rounded-2xl bg-white p-4 shadow dark:bg-slate-800 sm:flex-row sm:flex-wrap sm:items-end sm:p-5"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-slate-500">Matrícula</label>
            <select
              value={matriculaId}
              onChange={(e) => setMatriculaId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            >
              <option value="">Seleccionar...</option>
              {matriculas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombreEstudiante} — {m.nombreCurso}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-slate-500 dark:text-slate-300">Monto</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="500000"
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            />
          </div>
          <div className="w-full sm:w-40">
            <label className="text-xs text-slate-500 dark:text-slate-300">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            >
              <option value="PAGADO">Pagado</option>
              <option value="PENDIENTE">Pendiente</option>
            </select>
          </div>
          <button
            type="submit"
            className="self-start rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700"
          >
            Guardar
          </button>
        </form>
      )}

      <div className="mb-6 rounded-2xl bg-white p-4 shadow dark:bg-slate-800 sm:p-5">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-3">
          Consultar historial por estudiante
        </h2>
        <form
          onSubmit={handleConsultar}
          className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-end"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-slate-500 dark:text-slate-300">Estudiante</label>
            <select
              value={estudianteFiltro}
              onChange={(e) => setEstudianteFiltro(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            >
              <option value="">Seleccionar...</option>
              {estudiantes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombres} {e.apellidos}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:w-40">
            <label className="text-xs text-slate-500 dark:text-slate-300">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            />
          </div>
          <div className="sm:w-40">
            <label className="text-xs text-slate-500 dark:text-slate-300">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-1 rounded-lg bg-slate-100 px-5 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 sm:w-auto"
          >
            <Search size={16} /> Buscar
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-slate-800">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[540px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-left">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Monto</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-6 text-center text-slate-400"
                >
                  Buscando...
                </td>
              </tr>
            ) : ingresos.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-6 text-center text-slate-400"
                >
                  Selecciona un estudiante para ver su historial
                </td>
              </tr>
            ) : (
              ingresos.map((i) => (
                <tr
                  key={i.id}
                  className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                >
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{i.fecha}</td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-100 flex items-center gap-1">
                    <DollarSign size={14} className="text-orange-600" />{" "}
                    {Number(i.monto).toLocaleString("es-CO")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          i.estado === "PAGADO"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {i.estado}
                      </span>
                      {i.estado === "PENDIENTE" && (
                        <button
                          onClick={() => handleMarcarPagado(i.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 transition-colors hover:bg-emerald-100 dark:hover:bg-emerald-900/60"
                        >
                          <Check size={14} strokeWidth={2.5} />
                          Confirmar pago
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </Layout>
  );
}
