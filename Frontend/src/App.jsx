import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Estudiantes from "./pages/Estudiantes";
import Cursos from "./pages/Cursos";
import Materias from "./pages/Materias";
import Matriculas from "./pages/Matriculas";
import Ingresos from "./pages/Ingresos";
import Configuracion from "./pages/Configuracion";
import PortalEstudiante from "./pages/PortalEstudiante";
import PortalProfesor from "./pages/PortalProfesor";

function RutaProtegida({ children, roles }) {
  const { usuario } = useAuth();
  if (!usuario) return <Navigate to="/login" />;
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={usuario.rol === "ESTUDIANTE" ? "/estudiante" : usuario.rol === "PROFESOR" ? "/profesor" : "/dashboard"} />;
  }
  return children;
}

const ADMINISTRACION = ["ADMIN", "COORDINADOR"];

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<RutaProtegida roles={ADMINISTRACION}><Dashboard /></RutaProtegida>} />
            <Route path="/estudiantes" element={<RutaProtegida roles={ADMINISTRACION}><Estudiantes /></RutaProtegida>} />
            <Route path="/cursos" element={<RutaProtegida roles={ADMINISTRACION}><Cursos /></RutaProtegida>} />
            <Route path="/materias" element={<RutaProtegida roles={ADMINISTRACION}><Materias /></RutaProtegida>} />
            <Route path="/matriculas" element={<RutaProtegida roles={ADMINISTRACION}><Matriculas /></RutaProtegida>} />
            <Route path="/ingresos" element={<RutaProtegida roles={ADMINISTRACION}><Ingresos /></RutaProtegida>} />
            <Route path="/configuracion" element={<RutaProtegida><Configuracion /></RutaProtegida>} />
            <Route path="/estudiante" element={<RutaProtegida roles={["ESTUDIANTE"]}><PortalEstudiante /></RutaProtegida>} />
            <Route path="/profesor" element={<RutaProtegida roles={["PROFESOR"]}><PortalProfesor /></RutaProtegida>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
