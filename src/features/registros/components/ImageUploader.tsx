import { useEffect, useMemo } from "react";
import type { RegistroFormImageItem } from "../schemas/registro.schema";

type ImageUploaderProps = {
  files: RegistroFormImageItem[];
  error?: string;
  disabled?: boolean;
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
};

export function ImageUploader({
  files,
  error,
  disabled = false,
  onAddFiles,
  onRemoveFile,
}: ImageUploaderProps) {
  const previews = useMemo(() => {
    return files.map((item, index) => {
      if (item.kind === "existing") {
        return {
          id: item.id,
          url: item.publicUrl,
          name: item.storage_path.split("/").pop() || `imagen-${index + 1}`,
          sizeLabel: "Imagen existente",
          temporary: false,
        };
      }

      return {
        id: item.clientId,
        url: URL.createObjectURL(item.file),
        name: item.file.name,
        sizeLabel: `${(item.file.size / 1024 / 1024).toFixed(2)} MB`,
        temporary: true,
      };
    });
  }, [files]);

  useEffect(() => {
    return () => {
      previews.forEach((item) => {
        if (item.temporary) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [previews]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    onAddFiles(selectedFiles);
    event.target.value = "";
  };

  return (
    <div>
      <label className="form-label fw-semibold">Galería de imágenes</label>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <p className="mb-1 fw-semibold">Carga de imágenes</p>
                <small className="text-secondary">
                  Mínimo 3 y máximo 7 imágenes. Formatos: JPG, PNG, WEBP.
                </small>
              </div>

              <label className="btn btn-outline-primary mb-0">
                <i className="bi bi-upload me-2" />
                Agregar imágenes
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  hidden
                  disabled={disabled}
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="small text-secondary">
              Total seleccionadas: {files.length} / 7
            </div>

            {previews.length > 0 ? (
              <div className="row g-3">
                {previews.map((item, index) => (
                  <div className="col-12 col-sm-6 col-lg-4" key={`${item.id}-${index}`}>
                    <div className="card h-100 rounded-4 overflow-hidden">
                     <img
  src={item.url}
  alt={item.name}
  style={{ height: 180, objectFit: "cover" }}
  onError={(e) => {
    console.error("Error loading image:", item.url);
    e.currentTarget.style.display = "none";
  }}
/>
<div className="small text-break text-secondary mt-2">{item.url}</div>
                      <div className="card-body">
                        <div className="small fw-semibold text-truncate">
                          #{index + 1} · {item.name}
                        </div>
                        <div className="small text-secondary">{item.sizeLabel}</div>
                      </div>
                      <div className="card-footer bg-white border-0 pt-0">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger w-100"
                          onClick={() => onRemoveFile(index)}
                          disabled={disabled}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-4 p-4 text-center text-secondary">
                Aún no has seleccionado imágenes.
              </div>
            )}

            {error ? <div className="text-danger small">{error}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
}