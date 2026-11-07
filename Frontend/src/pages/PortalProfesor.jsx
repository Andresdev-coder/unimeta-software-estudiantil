import { useEffect, useState } from "react";
import { Bell, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import {
  crearNota,
  crearNotificacion,
  cursosNotificacionesProfesor,
  estudiantesMateria,
  materiasProfesor,
  notasProfesor,
  notificacionesProfesor,
} from "../services/portalService";

export default function PortalProfesor() {
  const [materias, setMaterias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [notas, setNotas] = useState([]);
  const [materiaId, setMateriaId] = useState("");
  const [estudianteId, setEstudianteId] = useState("");
  const [valor, setValor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [avisos, setAvisos] = useState([]);
  const [tituloAviso, setTituloAviso] = useState("");
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");
  const [cursosAviso, setCursosAviso] = useState([]);
  const [cursoAvisoId, setCursoAvisoId] = useState("");

  const cargarNotas = async () => {
    try {
      setNotas(await notasProfesor());
    } catch {
      toast.error("No se pudieron cargar las notas");
    }
  };
  useEffect(() => {
    materiasProfesor()
      .then(setMaterias)
      .catch(() => toast.error("No se pudieron cargar tus materias"));
    cargarNotas();
    notificacionesProfesor().then(setAvisos).catch(() => toast.error("No se pudieron cargar tus notificaciones"));
    cursosNotificacionesProfesor().then(setCursosAviso).catch(() => toast.error("No se pudieron cargar tus cursos"));
  }, []);
  useEffect(() => {
    if (!materiaId) {
      setEstudiantes([]);
      return;
    }
    estudiantesMateria(materiaId)
      .then(setEstudiantes)
      .catch(() =>
        toast.error("No se pudieron cargar los estudiantes de la materia"),
      );
  }, [materiaId]);

  const guardar = async (e) => {
    e.preventDefault();
    try {
      await crearNota({
        estudianteId: Number(estudianteId),
        materiaId: Number(materiaId),
        valor: Number(valor),
        descripcion,
      });
      toast.success("Nota registrada");
      setValor("");
      setDescripcion("");
      await cargarNotas();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "No se pudo registrar la nota",
      );
    }
  };

  const guardarAviso = async (e) => {
    e.preventDefault();
    try {
      await crearNotificacion({
        cursoId: Number(cursoAvisoId),
        titulo: tituloAviso,
        mensaje: mensajeAviso,
        fechaEvento: fechaEvento || null,
      });
      toast.success("Notificación enviada a los estudiantes de la materia");
      setTituloAviso("");
      setMensajeAviso("");
      setFechaEvento("");
      setAvisos(await notificacionesProfesor());
    } catch (error) {
      toast.error(error.response?.data?.message || "No se pudo enviar la notificación");
    }
  };

  return (
    <Layout title="Espacio del profesor">
      <section className="mb-5 min-w-0 rounded-2xl bg-white p-4 shadow dark:bg-slate-800 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">
          Registrar nota
        </h2>
        <form
          onSubmit={guardar}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-end"
        >
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Materia
            <select
              required
              value={materiaId}
              onChange={(e) => {
                setMateriaId(e.target.value);
                setEstudianteId("");
              }}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5"
            >
              <option value="">Seleccionar...</option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Estudiante
            <select
              required
              disabled={!materiaId}
              value={estudianteId}
              onChange={(e) => setEstudianteId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5"
            >
              <option value="">Seleccionar...</option>
              {estudiantes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombres} {e.apellidos}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Nota (0 a 5)
            <input
              required
              type="number"
              min="0"
              max="5"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5"
            />
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            Actividad
            <input
              required
              maxLength="150"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Parcial, taller..."
              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5"
            />
          </label>
          <button
            disabled={!estudianteId}
            className="md:col-span-2 xl:col-span-4 justify-self-start rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white px-5 py-2.5"
          >
            Guardar nota
          </button>
        </form>
      </section>
      <section className="mb-5 min-w-0 rounded-2xl bg-white p-4 shadow dark:bg-slate-800 sm:p-6">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-100"><Bell size={19} /> Notificar a mis estudiantes</h2>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">El aviso llegará a los estudiantes matriculados en el curso seleccionado.</p>
        <form onSubmit={guardarAviso} className="grid grid-cols-1 items-end gap-3 md:grid-cols-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">Curso
            <select required value={cursoAvisoId} onChange={(e) => setCursoAvisoId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100">
              <option value="">Seleccionar...</option>
              {cursosAviso.map((curso) => <option key={curso.id} value={curso.id}>{curso.nombre}</option>)}
            </select>
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">Título
            <input required maxLength="120" value={tituloAviso} onChange={(e) => setTituloAviso(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300 md:col-span-2">Mensaje
            <textarea required maxLength="1000" rows="3" value={mensajeAviso} onChange={(e) => setMensajeAviso(e.target.value)} className="mt-1 w-full resize-y rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">Fecha del evento (opcional)
            <input type="datetime-local" value={fechaEvento} onChange={(e) => setFechaEvento(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2.5 text-slate-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100" />
          </label>
          <button disabled={!cursoAvisoId} className="justify-self-start rounded-lg bg-blue-700 px-5 py-2.5 text-white hover:bg-blue-800 disabled:opacity-50">Enviar notificación</button>
        </form>
        {avisos.length > 0 && <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100">Notificaciones enviadas</h3>
          {avisos.map((aviso) => <article key={aviso.id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700/60">
            <div className="flex flex-wrap items-center justify-between gap-2"><strong className="text-sm text-slate-800 dark:text-slate-100">{aviso.titulo}</strong><span className="text-xs text-blue-700 dark:text-blue-300">{aviso.curso}</span></div>
            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{aviso.mensaje}</p>
            {aviso.fechaEvento && <p className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><CalendarDays size={14} />{new Date(aviso.fechaEvento).toLocaleString("es-CO")}</p>}
          </article>)}
        </div>}
      </section>
      <section className="min-w-0 rounded-2xl bg-white p-4 shadow dark:bg-slate-800 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">
          Notas registradas por ti
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
              <tr>
                <th className="p-3">Estudiante</th>
                <th className="p-3">Materia</th>
                <th className="p-3">Actividad</th>
                <th className="p-3">Nota</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((n) => (
                <tr
                  key={n.id}
                  className="border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                >
                  <td className="p-3">{n.estudiante}</td>
                  <td className="p-3">{n.materia}</td>
                  <td className="p-3">{n.descripcion}</td>
                  <td className="p-3 font-semibold">{n.valor}</td>
                </tr>
              ))}
              {notas.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-5 text-center text-slate-500 dark:text-slate-300"
                  >
                    Aún no has registrado notas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
