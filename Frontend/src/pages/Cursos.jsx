import { useEffect, useState } from "react";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import {
  listarCursos,
  crearCurso,
  asociarMateria,
} from "../services/cursosService";
import { listarMaterias } from "../services/materiasService";

export default function Cursos() {
  const [cursos, setCursos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formAbierto, setFormAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [seleccion, setSeleccion] = useState({});

  const cargar = async () => {
    setCargando(true);
    try {
      const [cursosData, materiasData] = await Promise.all([
        listarCursos(),
        listarMaterias(),
      ]);
      setCursos(cursosData);
      setMaterias(materiasData);
    } catch (err) {
      toast.error("No se pudieron cargar los cursos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearCurso({ nombre });
      toast.success("Curso creado");
      setNombre("");
      setFormAbierto(false);
      cargar();
    } catch (err) {
      toast.error("Error al crear el curso");
    }
  };

  const handleAsociar = async (cursoId) => {
    const materiaId = seleccion[cursoId];
    if (!materiaId) return toast.error("Selecciona una materia primero");
    try {
      await asociarMateria(cursoId, materiaId);
      toast.success("Materia asociada al curso");
      cargar();
    } catch (err) {
      toast.error("Error al asociar la materia");
    }
  };

  return (
    <Layout title="Cursos">
      <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-500 dark:text-slate-300 text-sm">
          {cursos.length} cursos registrados
        </p>
        <button
          onClick={() => setFormAbierto(!formAbierto)}
          className="flex w-full items-center justify-center gap-1 whitespace-nowrap bg-emerald-700 hover:bg-emerald-800 text-white text-sm px-4 py-2 rounded-lg transition-colors sm:w-auto"
        >
          <Plus size={16} /> Nuevo curso
        </button>
      </div>

      {formAbierto && (
        <form
          onSubmit={handleCrear}
          className="mb-6 flex flex-col items-stretch gap-3 rounded-2xl bg-white p-4 shadow dark:bg-slate-800 sm:flex-row sm:items-end sm:p-5"
        >
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-300">Nombre del curso</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Ingeniería de Sistemas - Semestre 3"
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-5 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 transition-colors"
          >
            Guardar
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {cargando ? (
          <p className="text-slate-400">Cargando...</p>
        ) : cursos.length === 0 ? (
          <p className="text-slate-400">No hay cursos registrados</p>
        ) : (
          cursos.map((curso) => (
            <div key={curso.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <BookOpen size={18} />
                </div>
                <p className="font-medium text-slate-700 dark:text-slate-100">{curso.nombre}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {curso.materias?.length ? (
                  curso.materias.map((m) => (
                    <span
                      key={m.id}
                      className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full"
                    >
                      {m.nombre}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">
                    Sin materias asociadas
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={seleccion[curso.id] || ""}
                  onChange={(e) =>
                    setSeleccion({ ...seleccion, [curso.id]: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm"
                >
                  <option value="">Seleccionar materia...</option>
                  {materias.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleAsociar(curso.id)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-100 text-sm transition-colors"
                >
                  Asociar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
