import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRegistro } from "../services/update-registro.service";
import { appToast } from "../../../shared/utils/toast";

export function useUpdateRegistro() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateRegistro,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["registros"] });
            queryClient.invalidateQueries({ queryKey: ["registro", variables.id] });
            appToast.success("Registro actualizado correctamente");
        },
        onError: (error) => {
            appToast.error(error instanceof Error ? error.message : "Error al actualizar registro");
        },
    });
}