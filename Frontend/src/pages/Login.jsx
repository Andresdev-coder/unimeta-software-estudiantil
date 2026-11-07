import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BookOpenCheck, Eye, EyeOff, GraduationCap, LockKeyhole, ShieldCheck, UserRound, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const beneficios = [
  { icon: UsersRound, texto: "Consulta tu información académica en un solo lugar" },
  { icon: ShieldCheck, texto: "Acceso seguro para estudiantes y profesores" },
  { icon: GraduationCap, texto: "Mantente al día con tu vida universitaria" },
];

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const sesion = await login(username, password);
      toast.success("Bienvenido a UNIMETA");
      navigate(sesion.rol === "ESTUDIANTE" ? "/estudiante" : sesion.rol === "PROFESOR" ? "/profesor" : "/dashboard");
    } catch {
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white text-slate-900 lg:grid-cols-2">
      <section className="relative flex min-h-[330px] flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-950 px-7 py-8 sm:px-12 lg:min-h-screen lg:px-12 lg:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-[-4rem] h-96 w-96 rounded-full bg-white/10" />
        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20"><BookOpenCheck size={21} /></span>
          <span className="text-lg font-bold tracking-wide">UNIMETA</span>
        </div>

        <div className="relative max-w-xl py-12 lg:py-0">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-100">Sistema académico</p>
          <h1 className="mb-8 text-4xl font-bold leading-tight sm:text-5xl">Tu universidad,<br />siempre contigo.</h1>
          <ul className="space-y-5">
            {beneficios.map(({ icon: Icon, texto }) => (
              <li key={texto} className="flex items-center gap-3 text-sm text-blue-50 sm:text-base">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"><Icon size={19} /></span>
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-blue-100/80">Universidad Metropolitana de Villavicencio</p>
      </section>

      <section className="flex min-h-[540px] items-center justify-center rounded-t-[2.5rem] bg-white px-6 py-14 sm:px-10 lg:min-h-screen lg:rounded-l-[3rem] lg:rounded-tr-none lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Bienvenido de nuevo</h2>
            <p className="mt-2 text-sm text-slate-500">Ingresa a tu cuenta para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-700">Usuario</label>
              <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-slate-500 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
                <UserRound size={18} aria-hidden="true" />
                <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
              <div className="flex h-11 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 text-slate-500 transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
                <LockKeyhole size={18} aria-hidden="true" />
                <input id="password" type={mostrarPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="h-full min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" />
                <button type="button" onClick={() => setMostrarPassword(!mostrarPassword)} aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"} className="rounded p-1 transition hover:text-white">
                  {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={cargando} className="h-11 w-full rounded-lg bg-blue-700 text-sm font-semibold text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111522] disabled:cursor-not-allowed disabled:opacity-60">
              {cargando ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3 text-xs text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            <span>Acceso para la comunidad UNIMETA</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <p className="text-center text-xs leading-relaxed text-slate-500">Si tienes problemas para ingresar, comunícate con el área de soporte académico.</p>
        </div>
      </section>
    </main>
  );
}
