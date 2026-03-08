import { useEffect, useMemo, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";

import { QrPreview } from "../../../shared/components/QrPreview";
import { ImageUploader } from "./ImageUploader";
import {
  registroSchema,
  type RegistroFormInput,
  type RegistroFormValues,
  type RegistroSubmitStatus,
} from "../schemas/registro.schema";
import { buildRegistroBaseSlug } from "../utils/buildRegistroSlug";

type SubmitAction = {
  label: string;
  loadingLabel: string;
  status: RegistroSubmitStatus;
  className: string;
};

type RegistroFormProps = {
  isLoading?: boolean;
  initialValues?: RegistroFormValues;
  fixedQrValue?: string;
  submitActions?: SubmitAction[];
  onSubmit: (
    values: RegistroFormValues,
    targetStatus: RegistroSubmitStatus
  ) => Promise<void> | void;
};

function getDefaultValues(): RegistroFormInput {
  return {
    anio: new Date().getFullYear(),
    descripcion: "",
    anio_publicacion: new Date().getFullYear(),
    fecha: format(new Date(), "yyyy-MM-dd"),
    imagenes: [],
  };
}

const defaultSubmitActions: SubmitAction[] = [
  {
    label: "Guardar borrador",
    loadingLabel: "Guardando...",
    status: "draft",
    className: "btn btn-outline-primary",
  },
  {
    label: "Enviar a aprobación",
    loadingLabel: "Enviando...",
    status: "pending",
    className: "btn btn-primary",
  },
];

export function RegistroForm({
  isLoading = false,
  initialValues,
  fixedQrValue,
  submitActions = defaultSubmitActions,
  onSubmit,
}: RegistroFormProps) {
  const [submitMode, setSubmitMode] = useState<RegistroSubmitStatus>(
    submitActions[0]?.status ?? "draft"
  );

  const resolvedInitialValues = useMemo<RegistroFormInput>(
    () => initialValues ?? getDefaultValues(),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistroFormInput, unknown, RegistroFormValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: resolvedInitialValues,
  });

  useEffect(() => {
    reset(resolvedInitialValues);
  }, [resolvedInitialValues, reset]);

  const imagenes = watch("imagenes") ?? [];
  const anio = watch("anio");
  const descripcion = watch("descripcion");
  const anioPublicacion = watch("anio_publicacion");

  const qrPreviewUrl = useMemo(() => {
    if (fixedQrValue) return fixedQrValue;

    const baseSlug = buildRegistroBaseSlug({
      anio,
      descripcion,
      anioPublicacion,
    });

    return `${window.location.origin}/public/r/${baseSlug || "registro-preview"}`;
  }, [anio, descripcion, anioPublicacion, fixedQrValue]);

  const handleAddFiles = (newFiles: File[]) => {
    const currentFiles = watch("imagenes") ?? [];

    const mappedNewFiles: RegistroFormInput["imagenes"] = newFiles.map((file) => ({
      kind: "new" as const,
      clientId: crypto.randomUUID(),
      file,
    }));

    const nextFiles = [...currentFiles, ...mappedNewFiles];

    if (nextFiles.length > 7) {
      toast.error("Solo puedes seleccionar un máximo de 7 imágenes");
      return;
    }

    setValue("imagenes", nextFiles, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const currentFiles = watch("imagenes") ?? [];
    const nextFiles = currentFiles.filter((_, index) => index !== indexToRemove);

    setValue("imagenes", nextFiles, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const submitHandler: SubmitHandler<RegistroFormValues> = async (values) => {
    await onSubmit(values, submitMode);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="d-flex flex-column gap-4">
      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Año</label>
                  <input
                    type="number"
                    className={`form-control ${errors.anio ? "is-invalid" : ""}`}
                    {...register("anio")}
                  />
                  {errors.anio ? (
                    <div className="invalid-feedback">{errors.anio.message}</div>
                  ) : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Año de publicación</label>
                  <input
                    type="number"
                    className={`form-control ${
                      errors.anio_publicacion ? "is-invalid" : ""
                    }`}
                    {...register("anio_publicacion")}
                  />
                  {errors.anio_publicacion ? (
                    <div className="invalid-feedback">
                      {errors.anio_publicacion.message}
                    </div>
                  ) : null}
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">Descripción</label>
                  <textarea
                    rows={5}
                    className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
                    placeholder="Describe el registro histórico o visual"
                    {...register("descripcion")}
                  />
                  {errors.descripcion ? (
                    <div className="invalid-feedback">{errors.descripcion.message}</div>
                  ) : null}
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label fw-semibold">Fecha</label>
                  <input
                    type="date"
                    className={`form-control ${errors.fecha ? "is-invalid" : ""}`}
                    {...register("fecha")}
                  />
                  {errors.fecha ? (
                    <div className="invalid-feedback">{errors.fecha.message}</div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body d-flex flex-column justify-content-between gap-3">
              <div>
                <h5 className="fw-bold mb-2">Vista previa del QR</h5>
                <p className="text-secondary mb-3">
                  El QR apuntará a la vista pública del registro.
                </p>
              </div>

              <div className="text-center">
                <QrPreview value={qrPreviewUrl} />
              </div>

              <div className="small text-secondary">
                <div className="fw-semibold mb-1">URL del QR</div>
                <div className="text-break">{qrPreviewUrl}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImageUploader
        files={imagenes}
        error={errors.imagenes?.message}
        disabled={isLoading}
        onAddFiles={handleAddFiles}
        onRemoveFile={handleRemoveFile}
      />

      <div className="d-flex justify-content-end gap-2 flex-wrap">
        {submitActions.map((action) => (
          <button
            key={action.status}
            type="submit"
            className={action.className}
            disabled={isLoading}
            onClick={() => setSubmitMode(action.status)}
          >
            {isLoading && submitMode === action.status
              ? action.loadingLabel
              : action.label}
          </button>
        ))}
      </div>
    </form>
  );
}