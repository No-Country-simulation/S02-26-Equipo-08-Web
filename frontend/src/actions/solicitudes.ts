"use server";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getUserIdFromToken(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? null;
  if (!token) return null;
  try {
    const payload = decodeJwt(token);
    return (payload.id as number) ?? null;
  } catch {
    return null;
  }
}

export interface Solicitud {
  id: number;
  fecha_del_servicio: string;
  hora_inicio: string;
  cantidad_horas_solicitadas: number;
  observaciones?: string;
  id_pedido_estado?: number;
  estado?: string;
  paciente_nombre?: string;
  paciente_apellido?: string;
}

export async function crearSolicitud(datos: {
  id_paciente: number;
  fecha_del_servicio: string;
  hora_inicio: string;
  cantidad_horas_solicitadas: number;
  observaciones?: string;
}): Promise<{ success: boolean; message: string; data?: unknown }> {
  const userId = await getUserIdFromToken();
  if (!userId) return { success: false, message: "No autenticado." };

  try {
    const res = await fetch(`${API_URL}/pedidos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...datos,
        id_usuario: userId,
      }),
    });
    return await res.json();
  } catch (error) {
    console.error("crearSolicitud error:", error);
    return { success: false, message: "Error de conexión." };
  }
}

export async function listarMisSolicitudes(): Promise<Solicitud[]> {
  const userId = await getUserIdFromToken();
  if (!userId) return [];

  try {
    const res = await fetch(`${API_URL}/pedidos/usuario/${userId}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("listarMisSolicitudes error:", error);
    return [];
  }
}
