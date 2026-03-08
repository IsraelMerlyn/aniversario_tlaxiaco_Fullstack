import { QRCodeSVG } from "qrcode.react";

type QrPreviewProps = {
  value: string;
  size?: number;
};

export function QrPreview({ value, size = 180 }: QrPreviewProps) {
  return (
    <div
      className="rounded-4 border p-3 d-inline-flex bg-white"
      style={{ borderColor: "var(--steel-300)" }}
    >
      <QRCodeSVG value={value} size={size} />
    </div>
  );
}