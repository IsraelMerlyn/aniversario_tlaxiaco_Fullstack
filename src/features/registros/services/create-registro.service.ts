import { supabase } from "../../../integrations/supabase/client";
import type {
    RegistroFormImageItem,
    RegistroFormValues,
    RegistroSubmitStatus,
} from "../schemas/registro.schema";
import { buildRegistroQrSlug } from "../utils/buildRegistroSlug";

export type CreateRegistroPayload = RegistroFormValues & {
    targetStatus: RegistroSubmitStatus;
};

function isNewImage(
    image: RegistroFormImageItem
): image is Extract<RegistroFormImageItem, { kind: "new" }> {
    return image.kind === "new";
}

export async function createRegistro(payload: CreateRegistroPayload) {
    const { anio, descripcion, anio_publicacion, fecha, imagenes, targetStatus } = payload;

    const newImages = imagenes.filter(isNewImage);

    if (newImages.length < 3 || newImages.length > 7) {
        throw new Error("Debes cargar entre 3 y 7 imágenes");
    }

    const qrSlug = buildRegistroQrSlug({
        anio,
        descripcion,
        anioPublicacion: anio_publicacion,
    });

    const folder = `${qrSlug}-${Date.now()}`;
    const uploadedPaths: string[] = [];
    let createdRegistroId: string | null = null;

    try {
        for (let index = 0; index < newImages.length; index++) {
            const item = newImages[index];
            const file = item.file;
            const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
            const filePath = `${folder}/${index + 1}-${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from("registros-img")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                throw new Error(`Error al subir imagen ${index + 1}: ${uploadError.message}`);
            }

            uploadedPaths.push(filePath);
        }

        const { data: registro, error: registroError } = await supabase
            .from("registros")
            .insert({
                anio,
                descripcion,
                anio_publicacion,
                fecha,
                status: targetStatus,
                qr_slug: qrSlug,
            })
            .select("id, qr_slug")
            .single();

        if (registroError) {
            throw new Error(`Error al crear el registro: ${registroError.message}`);
        }

        createdRegistroId = registro.id;

        const imagenRows = uploadedPaths.map((storagePath, index) => ({
            registro_id: registro.id,
            storage_path: storagePath,
            orden: index + 1,
        }));

        const { error: imagenesError } = await supabase
            .from("registro_imagenes")
            .insert(imagenRows);

        if (imagenesError) {
            throw new Error(`Error al guardar imágenes: ${imagenesError.message}`);
        }

        return registro;
    } catch (error) {
        if (uploadedPaths.length > 0) {
            await supabase.storage.from("registros-img").remove(uploadedPaths);
        }

        if (createdRegistroId) {
            await supabase.from("registros").delete().eq("id", createdRegistroId);
        }

        throw error instanceof Error ? error : new Error("No se pudo crear el registro");
    }
}