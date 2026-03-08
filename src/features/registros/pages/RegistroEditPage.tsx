import { useNavigate, useParams } from "react-router-dom";
import { RegistroForm } from "../components/RegistroForm";
import { useRegistro } from "../hooks/useRegistros";
import { useUpdateRegistro } from "../hooks/seUpdateRegistro";
import { mapRegistroToFormValues } from "../utils/mapRegistroToFormValues";
import type {
  RegistroFormValues,
  RegistroSubmitStatus,
} from "../schemas/registro.schema";

export function RegistroEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const registroQuery = useRegistro(id);
  const updateRegistroMutation = useUpdateRegistro();

  const registro = registroQuery.data;

  const handleSubmit = async (
    values: RegistroFormValues,
    targetStatus: RegistroSubmitStatus
  ) => {
    if (!registro || !id) return;

    await updateRegistroMutation.mutateAsync({
      id,
      values,
      targetStatus,
      previousImages: mapRegistroToFormValues(registro).imagenes.filter(
        (img) => img.kind === "existing"
      ),
    });

    navigate("/registros");
  };

  if (registroQuery.isLoading) {
    return <div className="text-secondary">Cargando registro...</div>;
  }

  if (registroQuery.isError || !registro) {
    return <div className="alert alert-danger">No se pudo cargar el registro.</div>;
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1">Editar registro</h2>
        <p className="text-secondary mb-0">
          Actualiza la información y reorganiza su galería.
        </p>
      </div>

      <RegistroForm
        isLoading={updateRegistroMutation.isPending}
        initialValues={mapRegistroToFormValues(registro)}
        fixedQrValue={`${window.location.origin}/public/r/${registro.qr_slug}`}
        submitActions={[
          {
            label: "Guardar cambios",
            loadingLabel: "Guardando...",
            status: registro.status,
            className: "btn btn-primary",
          },
          {
            label: "Enviar a aprobación",
            loadingLabel: "Enviando...",
            status: "pending",
            className: "btn btn-outline-primary",
          },
        ]}
        onSubmit={handleSubmit}
      />
    </section>
  );
}