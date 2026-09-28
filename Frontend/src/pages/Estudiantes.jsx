import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import EstudianteFormModal from "../components/EstudianteFormModal";
import {
  listarEstudiantes,
  buscarEstudiantes,
  crearEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
  subirFotoEstudiante,
} from "../services/estudiantesService";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [texto, setTexto] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [estudianteEditar, setEstudianteEditar] = useState(null);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await listarEstudiantes();
      setEstudiantes(data);
    } catch (err) {
      toast.error("No se pudieron cargar los estudiantes");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return cargar();
    try {
      const data = await buscarEstudiantes(texto);
      setEstudiantes(data);
    } catch (err) {
      toast.error("Error al buscar");
    }
  };

  const abrirNuevo = () => {
    setEstudianteEditar(null);
    setModalAbierto(true);
  };

  const abrirEditar = (estudiante) => {
    setEstudianteEditar(estudiante);
    setModalAbierto(true);
  };

  const handleGuardar = async (form, foto) => {
    try {
      let guardado;
      if (estudianteEditar) {
        guardado = await actualizarEstudiante(estudianteEditar.id, form);
        toast.success("Estudiante actualizado");
      } else {
        guardado = await crearEstudiante(form);
        toast.success("Estudiante registrado");
      }

      if (foto) {
        await subirFotoEstudiante(guardado.id, foto);
      }

      setModalAbierto(false);
      cargar();
    } catch (err) {
      toast.error("Error al guardar el estudiante");
    }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este estudiante?")) return;
    try {
      await eliminarEstudiante(id);
      toast.success("Estudiante eliminado");
      cargar();
    } catch (err) {
      toast.error("Error al eliminar");
    }
  };

  return (
    <Layout title="Estudiantes">
      <div className="mb-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <form
          onSubmit={handleBuscar}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 w-full max-w-sm"
        >
          <Search size={16} className="text-slate-400" />
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre, documento o curso..."
            className="bg-transparent text-sm outline-none w-full text-slate-700 dark:text-slate-100 placeholder:text-slate-400"
          />
        </form>

        <button
          onClick={abrirNuevo}
          className="flex w-full items-center justify-center gap-1 whitespace-nowrap bg-blue-700 hover:bg-blue-800 text-white text-sm px-4 py-2 rounded-lg transition-colors sm:w-auto"
        >
          <Plus size={16} /> Nuevo estudiante
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow dark:bg-slate-800">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-left">
            <tr>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Correo</th>
              <th className="px-4 py-3">Teléfono</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-slate-400"
                >
                  Cargando...
                </td>
              </tr>
            ) : estudiantes.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-6 text-center text-slate-400"
                >
                  No hay estudiantes registrados
                </td>
              </tr>
            ) : (
              estudiantes.map((est) => (
                <tr
                  key={est.id}
                  className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60"
                >
                  <td className="px-4 py-3">
                    {est.fotoUrl ? (
                      <img
                        src={`${API_URL}${est.fotoUrl}`}
                        alt={est.nombres}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-semibold">
                        {est.nombres?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-100">
                    {est.nombres} {est.apellidos}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{est.documento}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{est.correo}</td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-300">{est.telefono}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => abrirEditar(est)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleEliminar(est.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {modalAbierto && (
        <EstudianteFormModal
          estudiante={estudianteEditar}
          onClose={() => setModalAbierto(false)}
          onGuardar={handleGuardar}
        />
      )}
    </Layout>
  );
}
