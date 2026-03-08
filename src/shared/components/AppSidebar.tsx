import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `nav-link d-flex align-items-center gap-2 px-3 py-2 rounded-3 sidebar-link ${
    isActive ? "active" : ""
  }`;

export function AppSidebar() {
  return (
    <aside className="app-sidebar p-3">
      <div className="mb-4">
        <h5 className="text-white fw-bold mb-1">Historial</h5>
        <small className="text-white-50">Panel administrativo</small>
      </div>

      <nav className="nav flex-column gap-2">
        <NavLink to="/registros" className={linkClass}>
          <i className="bi bi-card-list" />
          <span>Registros</span>
        </NavLink>

        <NavLink to="/registros/nuevo" className={linkClass}>
          <i className="bi bi-plus-circle" />
          <span>Nuevo registro</span>
        </NavLink>

        <NavLink to="/aprobaciones" className={linkClass}>
          <i className="bi bi-patch-check" />
          <span>Aprobaciones</span>
        </NavLink>
      </nav>
    </aside>
  );
}