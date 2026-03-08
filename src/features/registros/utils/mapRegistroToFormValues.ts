import type { RegistroDetail } from "../types";
import type { RegistroFormValues } from "../schemas/registro.schema";
export function mapRegistroToFormValues(registro: RegistroDetail): RegistroFormValues {
    const mapped = {
        anio: registro.anio,
        descripcion: registro.descripcion,
        anio_publicacion: registro.anio_publicacion,
        fecha: registro.fecha,
        imagenes: registro.registro_imagenes.map((img) => ({
            kind: "existing" as const,
            id: img.id,
            storage_path: img.storage_path,
            publicUrl: img.publicUrl,
            orden: img.orden,
        })),
    };

    console.log("mapped form values", mapped);

    return mapped;
}