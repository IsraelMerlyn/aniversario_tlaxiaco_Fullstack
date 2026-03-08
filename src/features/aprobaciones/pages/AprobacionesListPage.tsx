import { Link } from "react-router-dom";
import { useRegistros } from "../../registros/hooks/useRegistros";

export function AprobacionesListPage() {
  const { data, isLoading, isError, error } = useRegistros({
    page: 1,
    pageSize: 10,
    status: "pending",
  });

  return (
    <section>
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1">Registros por aprobar</h2>
        <p className="text-secondary mb-0">
          Revisa, ajusta y cambia el estado de los registros pendientes.
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          {isLoading && (
            <div className="py-5 text-center text-secondary">Cargando pendientes...</div>
          )}

          {isError && (
            <div className="alert alert-danger mb-0">
              {(error as Error).message}
            </div>
          )}

          {!isLoading && !isError && (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Portada</th>
                    <th>Año</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                    <th>Imágenes</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data.length ? (
                    data.data.map((registro) => (
                      <tr key={registro.id}>
                        <td style={{ width: 90 }}>
                          {registro.coverUrl ? (
                            <img
                              src={registro.coverUrl}
                              alt={registro.descripcion}
                              className="rounded-3 border"
                              style={{
                                width: 56,
                                height: 56,
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <div
                              className="rounded-3 border d-flex align-items-center justify-content-center text-secondary"
                              style={{ width: 56, height: 56 }}
                            >
                              <i className="bi bi-image" />
                            </div>
                          )}
                        </td>
                        <td>{registro.anio}</td>
                        <td>{registro.descripcion}</td>
                        <td>{registro.fecha}</td>
                        <td>{registro.registro_imagenes.length}</td>
                        <td>
                          <Link
                            to={`/aprobaciones/${registro.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            Revisar
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center text-secondary py-5">
                        No hay registros pendientes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}