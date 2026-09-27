import { useEffect, useState } from "react";
import { Moon, Sun, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { listarEstudiantes } from "../services/estudiantesService";
import { listarMaterias } from "../services/materiasService";
import { crearPerfil, listarPerfiles } from "../services/portalService";

export default function Configuracion() {
  const { modoOscuro, alternarTema } = useTheme();
  const { usuario } = useAuth();
  const [rol, setRol] = useState("PROFESOR");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [estudianteId, setEstudianteId] = useState("");
  const [materiasIds, setMateriasIds] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [perfiles, setPerfiles] = useState([]);

  const cargarPerfiles = async () => {
    try { setPerfiles(await listarPerfiles()); }
    catch { toast.error("No se pudieron cargar los perfiles"); }
  };

  useEffect(() => {
    if (usuario?.rol !== "ADMIN") return;
    Promise.all([listarEstudiantes(), listarMaterias()])
      .then(([estudiantesData, materiasData]) => {
        setEstudiantes(estudiantesData);
        setMaterias(materiasData);
      })
      .catch(() => toast.error("No se pudieron cargar estudiantes y materias"));
    cargarPerfiles();
  }, [usuario?.rol]);

  const crear = async (e) => {
    e.preventDefault();
    try {
      await crearPerfil({
        username, password, nombreCompleto, rol,
        estudianteId: rol === "ESTUDIANTE" ? Number(estudianteId) : null,
        materiasIds: rol === "PROFESOR" ? materiasIds.map(Number) : [],
      });
      toast.success("Perfil creado correctamente");
      setNombreCompleto(""); setUsername(""); setPassword("");
      setEstudianteId(""); setMateriasIds([]);
      cargarPerfiles();
    } catch (error) {
      toast.error(error.response?.data?.message || "No se pudo crear el perfil");
    }
  };

  const toggleMateria = (id) => setMateriasIds((actuales) =>
    actuales.includes(id) ? actuales.filter((actual) => actual !== id) : [...actuales, id]);

  return (
    <Layout title="Configuración">
      <div className="space-y-6">
        <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6 max-w-xl">
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">Apariencia</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200">
                {modoOscuro ? <Moon size={18} /> : <Sun size={18} />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-100">Modo {modoOscuro ? "oscuro" : "claro"}</p>
                <p className="text-xs text-slate-400">Cambia el estilo de toda la interfaz</p>
              </div>
            </div>
            <button type="button" role="switch" aria-checked={modoOscuro} onClick={alternarTema}
              className={`w-12 h-6 rounded-full transition-colors relative ${modoOscuro ? "bg-blue-700" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${modoOscuro ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </section>

        {usuario?.rol === "ADMIN" && <>
          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <div className="flex items-center gap-2 mb-5 text-slate-700 dark:text-slate-100">
              <UserPlus size={20} />
              <h2 className="text-lg font-semibold">Crear perfil académico</h2>
            </div>
            <form onSubmit={crear} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="text-sm text-slate-600 dark:text-slate-300">Tipo de perfil
                <select value={rol} onChange={(e) => setRol(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5">
                  <option value="PROFESOR">Profesor</option><option value="ESTUDIANTE">Estudiante</option>
                </select>
              </label>
              <label className="text-sm text-slate-600 dark:text-slate-300">Nombre completo
                <input required value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5" />
              </label>
              <label className="text-sm text-slate-600 dark:text-slate-300">Usuario
                <input required autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5" />
              </label>
              <label className="text-sm text-slate-600 dark:text-slate-300">Contraseña inicial
                <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5" />
              </label>
              {rol === "ESTUDIANTE" ? (
                <label className="text-sm text-slate-600 dark:text-slate-300 md:col-span-2">Vincular con el registro del estudiante
                  <select required value={estudianteId} onChange={(e) => setEstudianteId(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 p-2.5">
                    <option value="">Seleccionar estudiante...</option>
                    {estudiantes.map((e) => <option key={e.id} value={e.id}>{e.nombres} {e.apellidos} · {e.documento}</option>)}
                  </select>
                </label>
              ) : (
                <fieldset className="md:col-span-2">
                  <legend className="text-sm text-slate-600 dark:text-slate-300 mb-2">Materias asignadas</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {materias.map((m) => <label key={m.id} className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-700 p-2 text-sm text-slate-700 dark:text-slate-200">
                      <input type="checkbox" checked={materiasIds.includes(String(m.id))} onChange={() => toggleMateria(String(m.id))} />{m.nombre}
                    </label>)}
                  </div>
                </fieldset>
              )}
              <button className="md:col-span-2 justify-self-start rounded-lg bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5">Crear perfil</button>
            </form>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">Perfiles registrados</h2>
            <div className="space-y-2">
              {perfiles.map((perfil) => <div key={perfil.id} className="flex justify-between gap-3 rounded-lg bg-slate-50 dark:bg-slate-700 px-4 py-3 text-sm">
                <span className="text-slate-700 dark:text-slate-100">{perfil.nombreCompleto} <span className="text-slate-400">({perfil.username})</span></span>
                <span className="text-blue-600 dark:text-blue-300">{perfil.rol === "PROFESOR" ? "Profesor" : "Estudiante"}</span>
              </div>)}
              {perfiles.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-300">Aún no hay perfiles creados.</p>}
            </div>
          </section>
        </>}
      </div>
    </Layout>
  );
}
