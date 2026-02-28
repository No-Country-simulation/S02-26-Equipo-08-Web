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

export interface SolicitudAdmin {
  id: number;
  fecha_del_servicio: string;
  hora_inicio: string;
  cantidad_horas_solicitadas: number;
  observaciones?: string;
  id_pedido_estado: number;
  estado: string;
  paciente_nombre: string;
  paciente_apellido: string;
  familiar_nombre: string;
  familiar_apellido: string;
  familiar_email: string;
  cuidador_nombre?: string | null;
  cuidador_apellido?: string | null;
}

export interface AsignacionCuidador {
  id: number;
  fecha_del_servicio: string;
  hora_inicio: string;
  cantidad_horas_solicitadas: number;
  observaciones?: string;
  id_pedido_estado: number;
  estado: string;
  paciente_nombre: string;
  paciente_apellido: string;
  paciente_diagnostico?: string | null;
  tarea_descripcion?: string | null;
  fecha_asignacion?: string | null;
}

export async function listarMisAsignaciones(): Promise<AsignacionCuidador[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/pedidos/mis-asignaciones`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch (error) {
    console.error("listarMisAsignaciones error:", error);
    return [];
  }
}

export interface SolicitudDetalle {
  id: number;
  fecha_del_servicio: string;
  hora_inicio: string;
  cantidad_horas_solicitadas: number;
  observaciones?: string;
  id_pedido_estado: number;
  estado: string;
  // Paciente
  paciente_nombre: string;
  paciente_apellido: string;
  paciente_diagnostico?: string | null;
  paciente_obra_social?: string | null;
  paciente_nro_afiliado?: string | null;
  // Familiar
  familiar_nombre: string;
  familiar_apellido: string;
  familiar_identificacion?: string | null;
  familiar_telefono?: string | null;
  familiar_email: string;
  parentesco?: string | null;
  // Asignación (si existe)
  asignacion_id?: number | null;
  fecha_asignacion?: string | null;
  cuidador_nombre?: string | null;
  cuidador_apellido?: string | null;
  cuidador_email?: string | null;
  tarea_descripcion?: string | null;
  valor_hora?: number | null;
  moneda?: string | null;
  asignado_por_email?: string | null;
}

export async function obtenerSolicitudAdmin(id: number): Promise<{
  success: boolean;
  data: SolicitudDetalle | null;
  message: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, data: null, message: "No autenticado." };
  }

  try {
    const res = await fetch(`${API_URL}/pedidos/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, data: null, message: err.message || "Error al obtener la solicitud." };
    }

    return await res.json();
  } catch (error) {
    console.error("obtenerSolicitudAdmin error:", error);
    return { success: false, data: null, message: "Error de conexión." };
  }
}

export interface CuidadorActivo {
  id: number;
  id_usuario: number;
  nombre: string;
  apellido: string;
  identificacion: string;
  telefono: string;
  email: string;
  disponible?: boolean;
}

export interface Tarea {
  id: number;
  descripcion: string;
  valor_hora: number;
  moneda: string | null;
}

export async function listarCuidadoresActivos(idPedido?: number): Promise<CuidadorActivo[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    console.error("[listarCuidadoresActivos] Sin token en cookies");
    return [];
  }
  try {
    const url = idPedido
      ? `${API_URL}/cuidadores/activos?id_pedido=${idPedido}`
      : `${API_URL}/cuidadores/activos`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`[listarCuidadoresActivos] HTTP ${res.status} para ${url} — respuesta: ${errorBody}`);
      return [];
    }
    const json = await res.json();
    return json.data ?? [];
  } catch (err) {
    console.error("[listarCuidadoresActivos] Error de red:", err);
    return [];
  }
}

export async function listarTareas(): Promise<Tarea[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return [];
  try {
    const res = await fetch(`${API_URL}/pedidos/tareas`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

export async function desasignarCuidadorAction(
  pedidoId: number
): Promise<{ success: boolean; message: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { success: false, message: "No autenticado." };
  try {
    const res = await fetch(`${API_URL}/pedidos/${pedidoId}/asignar`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch {
    return { success: false, message: "Error de conexión." };
  }
}

export async function asignarCuidadorAction(
  pedidoId: number,
  datos: { id_cuidador: number; id_tarea: number }
): Promise<{ success: boolean; message: string }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { success: false, message: "No autenticado." };
  try {
    const res = await fetch(`${API_URL}/pedidos/${pedidoId}/asignar`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Error de conexión." };
  }
}

export async function listarSolicitudesAdmin(params: {
  page?: number;
  limit?: number;
  estado?: string;
  busqueda?: string;
  fechaInicio?: string;
  fechaFin?: string;
}): Promise<{
  success: boolean;
  data: { solicitudes: SolicitudAdmin[]; total: number; totalPages: number };
  message: string;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, data: { solicitudes: [], total: 0, totalPages: 0 }, message: "No autenticado." };
  }

  try {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.estado) query.set("estado", params.estado);
    if (params.busqueda) query.set("busqueda", params.busqueda);
    if (params.fechaInicio) query.set("fechaInicio", params.fechaInicio);
    if (params.fechaFin) query.set("fechaFin", params.fechaFin);

    const res = await fetch(`${API_URL}/pedidos?${query.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, data: { solicitudes: [], total: 0, totalPages: 0 }, message: err.message || "Error al obtener solicitudes." };
    }

    return await res.json();
  } catch (error) {
    console.error("listarSolicitudesAdmin error:", error);
    return { success: false, data: { solicitudes: [], total: 0, totalPages: 0 }, message: "Error de conexión." };
  }
}
