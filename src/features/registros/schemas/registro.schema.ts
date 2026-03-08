import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageFileSchema = z
    .custom<File>((value) => value instanceof File, "Archivo inválido")
    .refine((file) => file.size <= MAX_FILE_SIZE, "Cada imagen debe pesar máximo 5 MB")
    .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Solo se permiten imágenes JPG, PNG o WEBP"
    );

export const existingImageItemSchema = z.object({
    kind: z.literal("existing"),
    id: z.string().min(1),
    storage_path: z.string().min(1),
    publicUrl: z.string().min(1),
    orden: z.coerce.number().int().min(1).max(7),
});

export const newImageItemSchema = z.object({
    kind: z.literal("new"),
    clientId: z.string().min(1),
    file: imageFileSchema,
});

export const registroImageItemSchema = z.discriminatedUnion("kind", [
    existingImageItemSchema,
    newImageItemSchema,
]);

export const registroSchema = z.object({
    anio: z.coerce
        .number()
        .int("El año debe ser entero")
        .min(1900, "El año debe ser mayor o igual a 1900")
        .max(2100, "El año debe ser menor o igual a 2100"),
    descripcion: z
        .string()
        .trim()
        .min(10, "La descripción debe tener al menos 10 caracteres")
        .max(500, "La descripción no debe exceder 500 caracteres"),
    anio_publicacion: z.coerce
        .number()
        .int("El año de publicación debe ser entero")
        .min(1900, "El año de publicación debe ser mayor o igual a 1900")
        .max(2100, "El año de publicación debe ser menor o igual a 2100"),
    fecha: z.string().min(1, "La fecha es obligatoria"),
    imagenes: z
        .array(registroImageItemSchema)
        .min(3, "Debes cargar al menos 3 imágenes")
        .max(7, "Solo puedes cargar un máximo de 7 imágenes"),
});

export type RegistroFormInput = z.input<typeof registroSchema>;
export type RegistroFormValues = z.output<typeof registroSchema>;

export type RegistroFormImageItem = RegistroFormValues["imagenes"][number];
export type RegistroFormExistingImage = Extract<
    RegistroFormValues["imagenes"][number],
    { kind: "existing" }
>;

export type RegistroSubmitStatus = "draft" | "pending" | "approved" | "rejected";