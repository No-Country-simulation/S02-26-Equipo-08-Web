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
    const payload = decodeJwt(token);
    return (payload.id as number) ?? null;
  } catch {
    return null;
  }
}

export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  direccion?: string;
  telefono?: string;
  edad?: number;
  diagnostico?: string;
  obra_social?: string;
  nro_afiliado?: string;
  fecha_ingreso?: string;
  estado?: string;
  id_parentesco?: number;
  parentesco?: string;
}

export interface Parentesco {
  id: number;
  descripcion: string;
}

export async function listarMisPacientes(): Promise<Paciente[]> {
  const userId = await getUserIdFromToken();
  if (!userId) return [];

  try {
    const res = await fetch(`${API_URL}/pacientes/familiar/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("listarMisPacientes error:", error);
    return [];
  }
}

export async function obtenerPaciente(id: number): Promise<Paciente | null> {
  try {
    const res = await fetch(`${API_URL}/pacientes/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error("obtenerPaciente error:", error);
    return null;
  }
}

export async function crearPaciente(datos: {
  nombre: string;
  apellido: string;
  identificacion: string;
  direccion?: string;
  telefono?: string;
  edad?: number;
  diagnostico?: string;
  obra_social?: string;
  nro_afiliado?: string;
  id_parentesco?: number;
}): Promise<{ success: boolean; message: string; data?: unknown }> {
  const userId = await getUserIdFromToken();
  if (!userId) return { success: false, message: "No autenticado." };

  try {
    const res = await fetch(`${API_URL}/pacientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...datos,
        id_usuario_familiar: userId,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("crearPaciente error:", error);
    return { success: false, message: "Error de conexión." };
  }
}

export async function actualizarPaciente(
  id: number,
  datos: Partial<Omit<Paciente, "id" | "estado" | "parentesco" | "fecha_ingreso">>
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_URL}/pacientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    return await res.json();
  } catch (error) {
    console.error("actualizarPaciente error:", error);
    return { success: false, message: "Error de conexión." };
  }
}

export async function listarParentescos(): Promise<Parentesco[]> {
  try {
    const res = await fetch(`${API_URL}/pacientes/parentescos`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("listarParentescos error:", error);
    return [];
  }
}

export async function eliminarPaciente(
  id: number
): Promise<{ success: boolean; message: string }> {
  const userId = await getUserIdFromToken();
  if (!userId) return { success: false, message: "No autenticado." };

  try {
    const res = await fetch(`${API_URL}/pacientes/${id}/familiar/${userId}`, {
      method: "DELETE",
    });
    return await res.json();
  } catch (error) {
    console.error("eliminarPaciente error:", error);
    return { success: false, message: "Error de conexión." };
  }
}