import { useCallback, useEffect, useState } from "react";
import { Send, BookOpen, MessageCircle } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { resumenEstudiante, listarMensajes, enviarMensaje } from "../services/portalService";

export default function PortalEstudiante() {
  const [resumen, setResumen] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const cargarMensajes = useCallback(async () => {
    try { setMensajes(await listarMensajes()); } catch { /* mantiene la sala visible si falla un sondeo */ }
  }, []);

  useEffect(() => {
    resumenEstudiante().then(setResumen).catch(() => toast.error("No se pudo cargar tu información académica"));
    cargarMensajes();
    const intervalo = setInterval(cargarMensajes, 5000);
    return () => clearInterval(intervalo);
  }, [cargarMensajes]);

  const enviar = async (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    try { await enviarMensaje(mensaje.trim()); setMensaje(""); await cargarMensajes(); }
    catch { toast.error("No se pudo enviar el mensaje"); }
  };

  return <Layout title="Mi espacio académico">
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
      <section className="min-w-0 bg-white dark:bg-slate-800 rounded-2xl shadow p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-1">Hola{resumen ? `, ${resumen.nombre}` : ""}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300 mb-5">Tus materias y calificaciones</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {resumen?.materias?.map((materia) => <span key={materia} className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-200 px-3 py-1.5 text-sm"><BookOpen size={14} />{materia}</span>)}
          {resumen?.materias?.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-300">No tienes materias activas asignadas.</p>}
        </div>
        <h3 className="font-semibold text-slate-700 dark:text-slate-100 mb-3">Notas</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[580px] text-sm text-left">
            <thead className="text-slate-500 dark:text-slate-300 bg-slate-50 dark:bg-slate-700"><tr><th className="p-3">Materia</th><th className="p-3">Actividad</th><th className="p-3">Nota</th><th className="p-3">Profesor</th></tr></thead>
            <tbody>{resumen?.notas?.map((nota) => <tr key={nota.id} className="border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200"><td className="p-3">{nota.materia}</td><td className="p-3">{nota.descripcion}</td><td className="p-3 font-semibold">{nota.valor}</td><td className="p-3">{nota.profesor}</td></tr>)}
              {resumen?.notas?.length === 0 && <tr><td colSpan="4" className="p-5 text-center text-slate-500 dark:text-slate-300">Todavía no hay notas registradas.</td></tr>}</tbody>
          </table>
        </div>
      </section>

      <section className="min-w-0 bg-white dark:bg-slate-800 rounded-2xl shadow p-4 sm:p-6 flex flex-col min-h-[460px]">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-100 mb-1"><MessageCircle size={19} /> Sala común</h2>
        <p className="text-sm text-slate-500 dark:text-slate-300 mb-4">Conversación compartida entre estudiantes</p>
        <div className="flex-1 overflow-y-auto space-y-3 rounded-xl bg-slate-50 dark:bg-slate-900 p-4 mb-4">
          {mensajes.map((item) => <article key={item.id} className="rounded-lg bg-white dark:bg-slate-800 p-3 shadow-sm">
            <div className="flex justify-between gap-3 text-xs mb-1"><strong className="text-blue-700 dark:text-blue-300">{item.autor}</strong><time className="text-slate-400">{new Date(item.fecha).toLocaleString("es-CO")}</time></div>
            <p className="text-sm text-slate-700 dark:text-slate-200 break-words">{item.mensaje}</p>
          </article>)}
          {mensajes.length === 0 && <p className="text-center text-sm text-slate-500 dark:text-slate-300 py-8">Aún no hay mensajes. ¡Inicia la conversación!</p>}
        </div>
        <form onSubmit={enviar} className="flex gap-2">
          <input value={mensaje} maxLength={1000} onChange={(e) => setMensaje(e.target.value)} placeholder="Escribe un mensaje..." className="flex-1 min-w-0 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 px-3 py-2.5" />
          <button aria-label="Enviar mensaje" className="rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-4"><Send size={17} /></button>
        </form>
      </section>
    </div>
  </Layout>;
}
