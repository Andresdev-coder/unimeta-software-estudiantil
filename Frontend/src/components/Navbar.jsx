import { useNavigate } from "react-router-dom";
import { LogOut, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-blue-950 text-white px-6 py-3 shadow">
      <div className="flex items-center gap-2">
        <GraduationCap size={24} />
        <span className="font-bold text-lg">UNIMETA</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-blue-100">
          {usuario?.username}{" "}
          <span className="text-blue-300">({usuario?.rol})</span>
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-sm bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded-md transition-colors"
        >
          <LogOut size={16} />
          Salir
        </button>
      </div>
    </nav>
  );
}
