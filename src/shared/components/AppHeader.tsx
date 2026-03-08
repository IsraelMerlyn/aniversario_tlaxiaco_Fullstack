export function AppHeader() {
  return (
    <header className="app-header px-4 py-3 d-flex justify-content-between align-items-center">
      <div>
        <h4 className="mb-0 fw-bold">Gestión de registros</h4>
        <small className="text-secondary">
          React + Supabase + Bootstrap
        </small>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button className="btn btn-outline-primary btn-sm">Exportar</button>
        <button className="btn btn-primary btn-sm">Nuevo</button>
      </div>
    </header>
  );
}