import { supabase } from "../../../integrations/supabase/client";
import type { RegistroDetail, RegistroListItem, RegistroStatus } from "../types";

type GetRegistrosParams = {
    page?: number;
    pageSize?: number;
    status?: RegistroStatus | "all";
};

const REGISTROS_SELECT = `
  id,
  anio,
  descripcion,
  anio_publicacion,
  fecha,
  status,
  qr_slug,
  created_by,
  approved_by,
  approved_at,
  created_at,
  updated_at,
  registro_imagenes (
    id,
    registro_id,
    storage_path,
    orden,
    created_at
  )
`;

function toPublicUrl(storagePath: string) {
    const publicUrl = supabase.storage
        .from("registros-img")
        .getPublicUrl(storagePath).data.publicUrl;

    console.log("storagePath:", storagePath);
    console.log("publicUrl:", publicUrl);

    return publicUrl;
}

export async function getRegistros({
    page = 1,
    pageSize = 10,
    status = "all",
}: GetRegistrosParams = {}) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
        .from("registros")
        .select(REGISTROS_SELECT, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

    if (status !== "all") {
        query = query.eq("status", status);
    }

    const { data, error, count } = await query;

    if (error) {
        throw new Error(error.message);
    }

    const mapped: RegistroListItem[] = (data ?? []).map((registro) => {
        const orderedImages = [...(registro.registro_imagenes ?? [])]
            .sort((a, b) => a.orden - b.orden)
            .map((img) => ({
                ...img,
                publicUrl: toPublicUrl(img.storage_path),
            }));

        return {
            ...registro,
            registro_imagenes: orderedImages,
            coverUrl: orderedImages[0]?.publicUrl ?? null,
        };
    });

    return {
        data: mapped,
        count: count ?? 0,
        page,
        pageSize,
        totalPages: Math.ceil((count ?? 0) / pageSize),
    };
}

export async function getRegistroById(id: string) {
    const { data, error } = await supabase
        .from("registros")
        .select(REGISTROS_SELECT)
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    const orderedImages = [...(data.registro_imagenes ?? [])]
        .sort((a, b) => a.orden - b.orden)
        .map((img) => ({
            ...img,
            publicUrl: toPublicUrl(img.storage_path),
        }));

    const mapped: RegistroDetail = {
        ...data,
        registro_imagenes: orderedImages,
    };

    return mapped;
}
