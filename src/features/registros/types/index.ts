import type { Database } from "../../../integrations/supabase/database.types";

export type RegistroRow = Database["public"]["Tables"]["registros"]["Row"];
export type RegistroImagenRow =
    Database["public"]["Tables"]["registro_imagenes"]["Row"];
export type RegistroStatus = Database["public"]["Enums"]["registro_status"];

export type RegistroImagenView = RegistroImagenRow & {
    publicUrl: string;
};

export type RegistroListItem = RegistroRow & {
    registro_imagenes: RegistroImagenView[];
    coverUrl: string | null;
};

export type RegistroDetail = RegistroRow & {
    registro_imagenes: RegistroImagenView[];
};