import { Link } from "react-router-dom";
import { useRegistros } from "../hooks/useRegistros";

export function RegistrosListPage() {
  const { data, isLoading, isError, error } = useRegistros({
    page: 1,
    pageSize: 10,
    status: "all",
  });

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="h4 fw-bold mb-1">Lista de registros</h2>
          <p className="text-secondary mb-0">
            Listado general conectado a Supabase.
          </p>
        </div>

        <Link to="/registros/nuevo" className="btn btn-primary">
          Crear registro
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          {isLoading && (
            <div className="py-5 text-center text-secondary">Cargando...</div>
          )}

          {isError && (
            <div className="alert alert-danger mb-0">
              {(error as Error).message}
            </div>
          )}

          {!isLoading && !isError && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <small className="text-secondary">
                  Total de registros: {data?.count ?? 0}
                </small>
              </div>

              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Portada</th>
                      <th>Año</th>
                      <th>Descripción</th>
                      <th>Año publicación</th>
                      <th>Fecha</th>
                      <th>Estado</th>
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
                          <td>{registro.anio_publicacion}</td>
                          <td>{registro.fecha}</td>
                          <td>
                            <span className="badge text-bg-secondary text-uppercase">
                              {registro.status}
                            </span>
                          </td>
                          <td>{registro.registro_imagenes.length}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <Link
                                to={`/registros/${registro.id}/editar`}
                                className="btn btn-sm btn-outline-primary"
                              >
                                Editar
                              </Link>
                              <Link
                                to={`/aprobaciones/${registro.id}`}
                                className="btn btn-sm btn-outline-dark"
                              >
                                Revisar
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center text-secondary py-5"
                        >
                          No hay registros todavía
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}