"use client";

import { useEffect, useState, useCallback } from "react";
import { FileCheck, AlertCircle, Loader2, CheckCircle2, Clock } from "lucide-react";
import FileUpload from "@/src/components/documentos/FileUpload";
import {
  obtenerTiposDocumento,
  listarDocumentosUsuario,
  subirDocumento,
  eliminarDocumento,
  type TipoDocumento,
  type Documento,
} from "@/src/actions/documentos";
import { getMisDatos } from "@/src/actions/auth";

const rolToAplicaA: Record<string, string> = {
  "2": "cuidador",
  "3": "familiar",
};

export default function DocumentacionPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const [tipos, setTipos] = useState<TipoDocumento[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarDatos = useCallback(async () => {
    try {
      // Obtener datos frescos del token (no del contexto React)
      const datos = await getMisDatos();
      if (!datos?.id) {
        setError("No se encontró sesión activa.");
        setLoading(false);
        return;
      }

      const id = Number(datos.id);
      const role = Number(datos.role);
      setUserId(id);
      setUserRole(role);

      const aplica_a = rolToAplicaA[String(role)];
      if (!aplica_a) {
        setError("Tu rol no requiere carga de documentación.");
        setLoading(false);
        return;
      }

      const [tiposData, docsData] = await Promise.all([
        obtenerTiposDocumento(aplica_a),
        listarDocumentosUsuario(id),
      ]);
      setTipos(tiposData);
      setDocumentos(docsData);
    } catch {
      setError("Error al cargar los datos. Intentá más tarde.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleUpload = async (file: File, idTipoDocumento: number): Promise<boolean> => {
    if (!userId) return false;

    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("id_tipo_documento", String(idTipoDocumento));
    formData.append("id_usuario", String(userId));
    formData.append("subido_por", String(userId));

    const res = await subirDocumento(formData);
    if (res.success) {
      const docsActualizados = await listarDocumentosUsuario(userId);
      setDocumentos(docsActualizados);
    }
    return res.success;
  };

  const handleDelete = async (idDocumento: number): Promise<boolean> => {
    if (!userId) return false;

    const res = await eliminarDocumento(idDocumento);
    if (res.success) {
      const docsActualizados = await listarDocumentosUsuario(userId);
      setDocumentos(docsActualizados);
    }
    return res.success;
  };

  // Encontrar doc existente para un tipo
  const getDocExistente = (idTipo: number) => {
    return documentos.find((d) => d.id_tipo_documento === idTipo) ?? null;
  };

  // Calcular progreso
  const obligatorios = tipos.filter((t) => t.obligatorio);
  const obligatoriosSubidos = obligatorios.filter((t) => getDocExistente(t.id));
  const totalSubidos = documentos.length;
  const todosObligatorios = obligatorios.length > 0 && obligatoriosSubidos.length === obligatorios.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 size={32} className="text-blue-500 animate-spin" />
        <p className="mt-3 text-gray-500">Cargando documentación...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle size={32} className="text-red-400" />
        <p className="mt-3 text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-inter, system-ui, sans-serif)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileCheck size={28} className="text-blue-600" />
            Mi Documentación
          </h1>
          <p className="text-gray-500 mt-1">
            Subí tu documentación para completar tu perfil.
            {userRole === 2 && " Los documentos obligatorios son necesarios para ser aprobado."}
          </p>
        </div>

        {/* Indicador de progreso */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shrink-0 ${
          todosObligatorios
            ? "bg-green-100 text-green-700"
            : "bg-amber-100 text-amber-700"
        }`}>
          {todosObligatorios ? (
            <CheckCircle2 size={16} />
          ) : (
            <Clock size={16} />
          )}
          {obligatoriosSubidos.length}/{obligatorios.length} obligatorios
          {totalSubidos > 0 && ` · ${totalSubidos} total`}
        </div>
      </div>

      {/* Documentos obligatorios */}
      {obligatorios.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Documentos Obligatorios
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {obligatorios.map((tipo) => {
              const docExistente = getDocExistente(tipo.id);
              return (
                <FileUpload
                  key={tipo.id}
                  tipoDocumento={tipo}
                  documentoExistente={docExistente ? {
                    id: docExistente.id,
                    nombre_archivo: docExistente.nombre_archivo,
                    fecha_subida: docExistente.fecha_subida,
                  } : null}
                  onUpload={handleUpload}
                  onDelete={handleDelete}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Documentos opcionales */}
      {tipos.filter((t) => !t.obligatorio).length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Documentos Opcionales
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tipos
              .filter((t) => !t.obligatorio)
              .map((tipo) => {
                const docExistente = getDocExistente(tipo.id);
                return (
                  <FileUpload
                    key={tipo.id}
                    tipoDocumento={tipo}
                    documentoExistente={docExistente ? {
                      id: docExistente.id,
                      nombre_archivo: docExistente.nombre_archivo,
                      fecha_subida: docExistente.fecha_subida,
                    } : null}
                    onUpload={handleUpload}
                    onDelete={handleDelete}
                  />
                );
              })}
          </div>
        </div>
      )}

      {/* Info adicional */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Información sobre tus documentos</p>
          <ul className="mt-1 space-y-1 text-blue-700">
            <li>• Los archivos aceptados son PDF, JPG, PNG y WebP (máximo 5MB).</li>
            <li>• Podés reemplazar un documento subiendo uno nuevo del mismo tipo.</li>
            <li>• El administrador revisará tu documentación para activar tu cuenta.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
