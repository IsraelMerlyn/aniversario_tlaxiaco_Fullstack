import { useNavigate } from "react-router-dom";
import { RegistroForm } from "../components/RegistroForm";
import { useCreateRegistro } from "../hooks/useCreateRegistro";
import type {
  RegistroFormValues,
  RegistroSubmitStatus,
} from "../schemas/registro.schema";

export function RegistroCreatePage() {
  const navigate = useNavigate();
  const createRegistroMutation = useCreateRegistro();

  const handleCreateRegistro = async (
    values: RegistroFormValues,
    targetStatus: RegistroSubmitStatus
  ) => {
    await createRegistroMutation.mutateAsync({
      ...values,
      targetStatus,
    });

    navigate("/registros");
  };

  return (
    <section>
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-1">Crear registro</h2>
        <p className="text-secondary mb-0">
          Captura la información principal, sube de 3 a 7 imágenes y genera su QR.
        </p>
      </div>

      <RegistroForm
        isLoading={createRegistroMutation.isPending}
        onSubmit={handleCreateRegistro}
      />
    </section>
  );
}