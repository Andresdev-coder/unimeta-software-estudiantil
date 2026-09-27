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

function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<RutaProtegida><Dashboard /></RutaProtegida>} />
            <Route path="/estudiantes" element={<RutaProtegida><Estudiantes /></RutaProtegida>} />
            <Route path="/cursos" element={<RutaProtegida><Cursos /></RutaProtegida>} />
            <Route path="/materias" element={<RutaProtegida><Materias /></RutaProtegida>} />
            <Route path="/matriculas" element={<RutaProtegida><Matriculas /></RutaProtegida>} />
            <Route path="/ingresos" element={<RutaProtegida><Ingresos /></RutaProtegida>} />
            <Route path="/configuracion" element={<RutaProtegida><Configuracion /></RutaProtegida>} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}