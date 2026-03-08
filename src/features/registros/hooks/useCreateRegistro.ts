import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRegistro, type CreateRegistroPayload } from "../services/create-registro.service";

export function useCreateRegistro() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateRegistroPayload) => createRegistro(payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["registros"] });

            toast.success(
                variables.targetStatus === "pending"
                    ? "Registro enviado a aprobación"
                    : "Registro guardado como borrador"
            );
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Error al crear el registro");
        },
    });
}