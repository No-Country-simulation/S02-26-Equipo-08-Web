"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Image, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploadProps {
  tipoDocumento: {
    id: number;
    descripcion: string;
    obligatorio: boolean;
  };
  documentoExistente?: {
    id: number;
    nombre_archivo: string;
    fecha_subida: string;
  } | null;
  onUpload: (file: File, idTipoDocumento: number) => Promise<boolean>;
  onDelete?: (idDocumento: number) => Promise<boolean>;
  disabled?: boolean;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUpload({
  tipoDocumento,
  documentoExistente,
  onUpload,
  onDelete,
  disabled = false,
}: FileUploadProps) {
  const [status, setStatus] = useState<UploadStatus>(documentoExistente ? "success" : "idle");
  const [fileName, setFileName] = useState<string>(documentoExistente?.nombre_archivo ?? "");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Tipo no permitido. Usa PDF, JPG, PNG o WebP.";
    }
    if (file.size > MAX_SIZE) {
      return `El archivo supera los 5MB (${(file.size / 1024 / 1024).toFixed(1)}MB).`;
    }
    return null;
  };

  const handleFile = useCallback(
    async (file: File) => {
      const error = validateFile(file);
      if (error) {
        setErrorMsg(error);
        setStatus("error");
        return;
      }

      setStatus("uploading");
      setErrorMsg("");
      setFileName(file.name);

      try {
        const ok = await onUpload(file, tipoDocumento.id);
        setStatus(ok ? "success" : "error");
        if (!ok) setErrorMsg("Error al subir el archivo. Intentá de nuevo.");
      } catch {
        setStatus("error");
        setErrorMsg("Error de conexión.");
      }
    },
    [onUpload, tipoDocumento.id]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled || status === "uploading") return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled, status]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDelete = async () => {
    if (!onDelete || !documentoExistente) return;
    setStatus("uploading");
    const ok = await onDelete(documentoExistente.id);
    if (ok) {
      setStatus("idle");
      setFileName("");
    } else {
      setStatus("success");
      setErrorMsg("No se pudo eliminar.");
    }
  };

  const fileIcon = fileName?.toLowerCase().endsWith(".pdf") ? (
    <FileText size={20} className="text-red-500" />
  ) : (
    <Image size={20} className="text-blue-500" />
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-100">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-medium text-sm text-gray-800 truncate">
            {tipoDocumento.descripcion}
          </span>
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
            tipoDocumento.obligatorio
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {tipoDocumento.obligatorio ? "Obligatorio" : "Opcional"}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        {status === "success" && fileName ? (
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <CheckCircle size={18} className="text-green-600 shrink-0" />
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {fileIcon}
              <span className="text-sm text-gray-700 truncate">{fileName}</span>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors disabled:opacity-50"
              >
                Reemplazar
              </button>
              {onDelete && documentoExistente && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={disabled}
                  className="text-xs text-red-500 hover:text-red-700 font-medium p-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        ) : status === "uploading" ? (
          <div className="flex items-center justify-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <Loader2 size={20} className="text-blue-600 animate-spin" />
            <span className="text-sm text-blue-700">Subiendo {fileName}...</span>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && inputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed cursor-pointer transition-all ${
              dragOver
                ? "border-blue-400 bg-blue-50"
                : status === "error"
                ? "border-red-300 bg-red-50"
                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {status === "error" ? (
              <AlertCircle size={24} className="text-red-400" />
            ) : (
              <Upload size={24} className="text-gray-400" />
            )}
            <span className="text-sm text-gray-500 text-center">
              {status === "error" ? (
                <span className="text-red-600">{errorMsg}</span>
              ) : (
                <>
                  Arrastrá o <span className="text-blue-600 font-medium">seleccioná</span> un archivo
                </>
              )}
            </span>
            <span className="text-[11px] text-gray-400">PDF, JPG, PNG o WebP · Máx 5MB</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
