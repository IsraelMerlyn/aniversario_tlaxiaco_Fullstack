import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateRegistro } from "../services/update-registro.service";

export function useUpdateRegistro() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRegistro,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["registros"] });
            queryClient.invalidateQueries({ queryKey: ["registro", variables.id] });
            toast.success("Registro actualizado correctamente");
        },
        onError: (error) => {
            toast.error(error instanceof Error ? error.message : "Error al actualizar registro");
        },
    });
}