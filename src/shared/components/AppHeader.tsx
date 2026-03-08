import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import { appToast } from "../utils/toast";

export function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      appToast.error(error instanceof Error ? error.message : "No se pudo cerrar sesión");
    }
  };

  return (
    <header className="app-header px-4 py-3 d-flex justify-content-between align-items-center">
      <div>
        <h4 className="mb-0 fw-bold">Gestión de registros</h4>
        <small className="text-secondary">
          {user?.email ?? "Panel administrativo"}
        </small>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}