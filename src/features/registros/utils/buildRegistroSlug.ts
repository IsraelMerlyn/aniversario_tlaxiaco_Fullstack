type BuildRegistroBaseSlugParams = {
    anio?: number | string;
    descripcion?: string;
    anioPublicacion?: number | string;
};

function sanitizeSlugSegment(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 40);
}

export function buildRegistroBaseSlug({
    anio,
    descripcion,
    anioPublicacion,
}: BuildRegistroBaseSlugParams) {
    const yearPart = String(anio ?? "sin-anio");
    const publicationPart = String(anioPublicacion ?? "sin-publicacion");
    const descriptionPart = sanitizeSlugSegment(descripcion?.trim() || "registro");

    return `${yearPart}-${publicationPart}-${descriptionPart}`;
}

export function buildRegistroQrSlug(params: BuildRegistroBaseSlugParams) {
    const base = buildRegistroBaseSlug(params);
    const shortId = crypto.randomUUID().split("-")[0];

    return `${base}-${shortId}`;
}