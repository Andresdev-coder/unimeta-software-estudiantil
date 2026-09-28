import { useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import {
  listarMatriculas,
  crearMatricula,
} from "../services/matriculasService";
import { listarEstudiantes } from "../services/estudiantesService";
import { listarCursos } from "../services/cursosService";

export default function Matriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formAbierto, setFormAbierto] = useState(false);
  const [estudianteId, setEstudianteId] = useState("");
  const [cursoId, setCursoId] = useState("");

  const cargar = async () => {
    setCargando(true);
    try {
      const [matriculasData, estudiantesData, cursosData] = await Promise.all([
        listarMatriculas(),
        listarEstudiantes(),
        listarCursos(),
      ]);
      setMatriculas(matriculasData);
      setEstudiantes(estudiantesData);
      setCursos(cursosData);
    } catch (err) {
      toast.error("No se pudieron cargar las matrículas");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!estudianteId || !cursoId)
      return toast.error("Selecciona estudiante y curso");
    try {
      await crearMatricula({
        estudianteId: Number(estudianteId),
        cursoId: Number(cursoId),
      });
      toast.success("Matrícula creada");
      setEstudianteId("");
      setCursoId("");
      setFormAbierto(false);
      cargar();
    } catch (err) {
      toast.error("Error al crear la matrícula");
    }
  };

  return (
    <Layout title="Matrículas">
      <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500 dark:text-slate-300 text-sm">
          {matriculas.length} matrículas registradas
        </p>
        <button
          onClick={() => setFormAbierto(!formAbierto)}
          className="flex w-full items-center justify-center gap-1 whitespace-nowrap bg-blue-700 hover:bg-blue-800 text-white text-sm px-4 py-2 rounded-lg transition-colors sm:w-auto"
        >
          <Plus size={16} /> Nueva matrícula
        </button>
      </div>

      {formAbierto && (
        <form
          onSubmit={handleCrear}
          className="mb-6 grid grid-cols-1 items-end gap-3 rounded-2xl bg-white p-4 shadow dark:bg-slate-800 sm:grid-cols-2 sm:p-5"
        >
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-300">Estudiante</label>
            <select
              value={estudianteId}
              onChange={(e) => setEstudianteId(e.target.value)}
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
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-300">Curso</label>
            <select
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
            >
              <option value="">Seleccionar...</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="justify-self-start rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 sm:col-span-2"
          >
            Guardar
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-slate-800">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-left">
            <tr>
              <th className="px-4 py-3">Estudiante</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-slate-400"
                >
                  Cargando...
                </td>
              </tr>
            ) : matriculas.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-6 text-center text-slate-400"
                >
                  No hay matrículas registradas
                </td>
              </tr>
            ) : (
              matriculas.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                >
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-100 flex items-center gap-2">
                    <ClipboardList size={14} className="text-blue-600" />{" "}
                    {m.nombreEstudiante}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{m.nombreCurso}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-300">
                    {m.fechaMatricula}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                      {m.estado}
                    </span>
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
