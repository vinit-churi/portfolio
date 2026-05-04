"use client";

import { CldUploadWidget } from "next-cloudinary";
import { Image as ImageIcon, Upload } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  onUploaded: (url: string) => void;
  label?: ReactNode;
  className?: string;
  size?: "sm" | "md";
};

const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
}

export default function CloudinaryButton({
  onUploaded,
  label,
  className,
  size = "md",
}: Props) {
  if (!cloudinaryConfigured()) {
    return (
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Cloudinary not configured. Paste image URL:");
          if (url) onUploaded(url);
        }}
        className={
          className ??
          "inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-xs font-mono uppercase tracking-widest text-outline hover:text-white hover:border-white/20 transition-colors"
        }
      >
        <ImageIcon size={size === "sm" ? 12 : 14} /> {label ?? "Image URL"}
      </button>
    );
  }

  return (
    <CldUploadWidget
      uploadPreset={PRESET}
      options={{
        sources: ["local", "url", "camera", "google_drive"],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif", "svg", "avif"],
        maxImageFileSize: 8_000_000,
      }}
      onSuccess={(result) => {
        const info = result?.info;
        if (typeof info === "object" && info && "secure_url" in info) {
          const url = (info as { secure_url: string }).secure_url;
          if (url) onUploaded(url);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className={
            className ??
            "inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-xs font-mono uppercase tracking-widest text-outline hover:text-white hover:border-white/20 transition-colors"
          }
        >
          <Upload size={size === "sm" ? 12 : 14} /> {label ?? "Upload image"}
        </button>
      )}
    </CldUploadWidget>
  );
}
