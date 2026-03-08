import { useNavigate, useParams } from "react-router-dom";
import { RegistroForm } from "../../registros/components/RegistroForm";
import { useRegistro } from "../../registros/hooks/useRegistros";
import { useUpdateRegistro } from "../../registros/hooks/seUpdateRegistro";
import { mapRegistroToFormValues } from "../../registros/utils/mapRegistroToFormValues";
import type {
  RegistroFormValues,
  RegistroSubmitStatus,
} from "../../registros/schemas/registro.schema";

export function AprobacionDetailPage() {
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

    navigate("/aprobaciones");
  };

  if (registroQuery.isLoading) {
    return <div className="text-secondary">Cargando detalle...</div>;
  }

  if (registroQuery.isError || !registro) {
    return <div className="alert alert-danger">No se pudo cargar el registro.</div>;
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1">Detalle de aprobación</h2>
        <p className="text-secondary mb-0">
          Ajusta la información final y define el estado del registro.
        </p>
      </div>

      <RegistroForm
        isLoading={updateRegistroMutation.isPending}
        initialValues={mapRegistroToFormValues(registro)}
        fixedQrValue={`${window.location.origin}/public/r/${registro.qr_slug}`}
        submitActions={[
          {
            label: "Guardar pendiente",
            loadingLabel: "Guardando...",
            status: "pending",
            className: "btn btn-outline-primary",
          },
          {
            label: "Aprobar",
            loadingLabel: "Aprobando...",
            status: "approved",
            className: "btn btn-success",
          },
          {
            label: "Rechazar",
            loadingLabel: "Rechazando...",
            status: "rejected",
            className: "btn btn-outline-danger",
          },
        ]}
        onSubmit={handleSubmit}
      />
    </section>
  );
}