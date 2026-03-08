import { useQuery } from "@tanstack/react-query";
import { getRegistros, getRegistroById } from "../services/registros.service";

import type { RegistroStatus } from "../types";

type UseRegistrosParams = {
    page?: number;
    pageSize?: number;
    status?: RegistroStatus | "all";
};

export function useRegistros({
    page = 1,
    pageSize = 10,
    status = "all",
}: UseRegistrosParams = {}) {
    return useQuery({
        queryKey: ["registros", { page, pageSize, status }],
        queryFn: () => getRegistros({ page, pageSize, status }),
    });
}

export function useRegistro(id?: string) {
    return useQuery({
        queryKey: ["registro", id],
        queryFn: () => getRegistroById(id as string),
        enabled: Boolean(id),
    });
}