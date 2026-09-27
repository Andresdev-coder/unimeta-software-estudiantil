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
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500 dark:text-slate-300 text-sm">Registro y consulta de pagos</p>
        <button
          onClick={() => setFormAbierto(!formAbierto)}
          className="flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Registrar ingreso
        </button>
      </div>

      {formAbierto && (
        <form
          onSubmit={handleRegistrar}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 mb-6 flex gap-3 items-end flex-wrap"
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
          <div className="w-40">
            <label className="text-xs text-slate-500 dark:text-slate-300">Monto</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="500000"
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            />
          </div>
          <div className="w-40">
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
            className="py-2.5 px-5 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700 transition-colors"
          >
            Guardar
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-3">
          Consultar historial por estudiante
        </h2>
        <form
          onSubmit={handleConsultar}
          className="flex gap-3 items-end flex-wrap"
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
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-300">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            />
          </div>
          <div>
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
            className="flex items-center gap-1 py-2.5 px-5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 text-sm transition-colors"
          >
            <Search size={16} /> Buscar
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
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
    </Layout>
  );
}
