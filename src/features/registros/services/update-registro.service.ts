import { supabase } from "../../../integrations/supabase/client";
import type {
    RegistroFormExistingImage,
    RegistroFormImageItem,
    RegistroFormValues,
    RegistroSubmitStatus,
} from "../schemas/registro.schema";

type UpdateRegistroPayload = {
    id: string;
    values: RegistroFormValues;
    targetStatus: RegistroSubmitStatus;
    previousImages: RegistroFormExistingImage[];
};

function isExistingImage(
    image: RegistroFormImageItem
): image is RegistroFormExistingImage {
    return image.kind === "existing";
}

function isNewImage(
    image: RegistroFormImageItem
): image is Extract<RegistroFormImageItem, { kind: "new" }> {
    return image.kind === "new";
}

export async function updateRegistro({
    id,
    values,
    targetStatus,
    previousImages,
}: UpdateRegistroPayload) {
    const { anio, descripcion, anio_publicacion, fecha, imagenes } = values;

    if (imagenes.length < 3 || imagenes.length > 7) {
        throw new Error("La galería debe contener entre 3 y 7 imágenes");
    }

    const currentExistingImages = imagenes.filter(isExistingImage);
    const newImages = imagenes.filter(isNewImage);

    const keptExistingIds = new Set(currentExistingImages.map((img) => img.id));
    const removedExistingImages = previousImages.filter(
        (img) => !keptExistingIds.has(img.id)
    );

    const uploadedNewPaths: string[] = [];

    try {
        const { error: updateError } = await supabase
            .from("registros")
            .update({
                anio,
                descripcion,
                anio_publicacion,
                fecha,
                status: targetStatus,
            })
            .eq("id", id);

        if (updateError) {
            throw new Error(`Error al actualizar registro: ${updateError.message}`);
        }

        for (let index = 0; index < newImages.length; index++) {
            const item = newImages[index];
            const file = item.file;
            const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
            const filePath = `${id}/${Date.now()}-${index + 1}-${crypto.randomUUID()}.${extension}`;

            const { error: uploadError } = await supabase.storage
                .from("registros-img")
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                throw new Error(`Error al subir nueva imagen ${index + 1}: ${uploadError.message}`);
            }

            uploadedNewPaths.push(filePath);
        }

        const finalStoragePaths: string[] = [];
        let newImageIndex = 0;

        for (const image of imagenes) {
            if (image.kind === "existing") {
                finalStoragePaths.push(image.storage_path);
            } else {
                finalStoragePaths.push(uploadedNewPaths[newImageIndex]);
                newImageIndex += 1;
            }
        }

        const { error: deleteRowsError } = await supabase
            .from("registro_imagenes")
            .delete()
            .eq("registro_id", id);

        if (deleteRowsError) {
            throw new Error(`Error al reiniciar galería: ${deleteRowsError.message}`);
        }

        const rows = finalStoragePaths.map((storage_path, index) => ({
            registro_id: id,
            storage_path,
            orden: index + 1,
        }));

        const { error: insertRowsError } = await supabase
            .from("registro_imagenes")
            .insert(rows);

        if (insertRowsError) {
            throw new Error(`Error al guardar galería final: ${insertRowsError.message}`);
        }

        if (removedExistingImages.length > 0) {
            await supabase.storage
                .from("registros-img")
                .remove(removedExistingImages.map((img) => img.storage_path));
        }

        return { id };
    } catch (error) {
        if (uploadedNewPaths.length > 0) {
            await supabase.storage.from("registros-img").remove(uploadedNewPaths);
        }

        throw error instanceof Error
            ? error
            : new Error("No se pudo actualizar el registro");
    }
}