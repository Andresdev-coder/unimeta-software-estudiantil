import { useEffect, useState } from "react";
import { Plus, Layers } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { listarMaterias, crearMateria } from "../services/materiasService";

export default function Materias() {
  const [materias, setMaterias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [formAbierto, setFormAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [creditos, setCreditos] = useState("");

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await listarMaterias();
      setMaterias(data);
    } catch (err) {
      toast.error("No se pudieron cargar las materias");
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
      await crearMateria({ nombre, creditos: Number(creditos) || null });
      toast.success("Materia creada");
      setNombre("");
      setCreditos("");
      setFormAbierto(false);
      cargar();
    } catch (err) {
      toast.error("Error al crear la materia");
    }
  };

  return (
    <Layout title="Materias">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-500 dark:text-slate-300 text-sm">
          {materias.length} materias registradas
        </p>
        <button
          onClick={() => setFormAbierto(!formAbierto)}
          className="flex items-center gap-1 bg-purple-700 hover:bg-purple-800 text-white text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} /> Nueva materia
        </button>
      </div>

      {formAbierto && (
        <form
          onSubmit={handleCrear}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 mb-6 flex gap-3 items-end"
        >
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-300">Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Bases de Datos II"
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="w-32">
            <label className="text-xs text-slate-500 dark:text-slate-300">Créditos</label>
            <input
              type="number"
              value={creditos}
              onChange={(e) => setCreditos(e.target.value)}
              placeholder="3"
              className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="py-2.5 px-5 rounded-lg bg-purple-700 text-white text-sm font-medium hover:bg-purple-800 transition-colors"
          >
            Guardar
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargando ? (
          <p className="text-slate-400">Cargando...</p>
        ) : materias.length === 0 ? (
          <p className="text-slate-400">No hay materias registradas</p>
        ) : (
          materias.map((m) => (
            <div
              key={m.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow p-5 flex items-center gap-4"
            >
              <div className="p-3 rounded-lg bg-purple-50 text-purple-700">
                <Layers size={20} />
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-100">{m.nombre}</p>
                <p className="text-xs text-slate-400">
                  {m.creditos
                    ? `${m.creditos} créditos`
                    : "Sin créditos definidos"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
