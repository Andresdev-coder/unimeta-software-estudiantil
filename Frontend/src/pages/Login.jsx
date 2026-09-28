import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    } catch (error) {
      toast.error("Usuario o contraseña incorrectos");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col rounded-xl bg-white p-6 shadow-lg sm:p-10"
      >
        <div className="flex flex-col items-center mb-6">
          <LogIn size={32} className="text-blue-700" />
          <h1 className="mt-2 text-2xl font-bold text-blue-950">UNIMETA</h1>
          <p className="text-sm text-gray-500">
            Sistema de Registro Estudiantil
          </p>
        </div>

        <label className="text-sm text-gray-700 mb-1">Usuario</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          required
          className="mb-4 px-3 py-2 rounded-md border border-gray-300 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <label className="text-sm text-gray-700 mb-1">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="mb-6 px-3 py-2 rounded-md border border-gray-300 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-600"
        />

        <button
          type="submit"
          disabled={cargando}
          className="py-3 rounded-md bg-blue-700 text-white text-sm font-medium
                     hover:bg-blue-800 transition-colors disabled:opacity-60
                     disabled:cursor-not-allowed"
        >
          {cargando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
