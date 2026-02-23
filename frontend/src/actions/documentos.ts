"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "jose";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value ?? null;
}

async function getUserIdFromToken(): Promise<number | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const payload: any = decodeJwt(token);
    return payload.id ?? null;
  } catch {
    return null;
  }
}

export interface TipoDocumento {
  id: number;
  descripcion: string;
  aplica_a: string;
  obligatorio: boolean;
}

export interface Documento {
  id: number;
  id_tipo_documento: number;
  id_usuario: number | null;
  id_paciente: number | null;
  subido_por: number;
  nombre_archivo: string;
  nombre_guardado: string;
  ruta_archivo: string;
  mime_type: string | null;
  tamanio_bytes: number | null;
  fecha_subida: string;
  tipo_documento?: TipoDocumento | null;
}

export interface DocumentoResponse {
  success: boolean;
  data: any;
  message: string;
}

// Obtener tipos de documento según rol
export async function obtenerTiposDocumento(aplica_a: string): Promise<TipoDocumento[]> {
  try {
    const res = await fetch(`${API_URL}/documentos/tipos?aplica_a=${aplica_a}`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error("Error obteniendo tipos de documento:", error);
    return [];
  }
}

// Subir documento
export async function subirDocumento(formData: FormData): Promise<DocumentoResponse> {
  try {
    const res = await fetch(`${API_URL}/documentos/subir`, {
      method: "POST",
      body: formData,
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error subiendo documento:", error);
    return { success: false, data: null, message: "Error de conexión con el servidor" };
  }
}

// Listar documentos de un usuario
export async function listarDocumentosUsuario(idUsuario: number): Promise<Documento[]> {
  try {
    const res = await fetch(`${API_URL}/documentos/usuario/${idUsuario}`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error("Error listando documentos:", error);
    return [];
  }
}

// Listar documentos de un paciente
export async function listarDocumentosPaciente(idPaciente: number): Promise<Documento[]> {
  try {
    const res = await fetch(`${API_URL}/documentos/paciente/${idPaciente}`, {
      cache: "no-store",
    });
    const json = await res.json();
    return json.success ? json.data : [];
  } catch (error) {
    console.error("Error listando documentos del paciente:", error);
    return [];
  }
}

// Eliminar documento
export async function eliminarDocumento(idDocumento: number): Promise<DocumentoResponse> {
  try {
    const res = await fetch(`${API_URL}/documentos/${idDocumento}`, {
      method: "DELETE",
    });
    const json = await res.json();
    return json;
  } catch (error) {
    console.error("Error eliminando documento:", error);
    return { success: false, data: null, message: "Error de conexión con el servidor" };
  }
}

// Obtener ID del usuario logueado
export async function obtenerUsuarioId(): Promise<number | null> {
  return getUserIdFromToken();
}
