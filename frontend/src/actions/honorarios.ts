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

export interface Servicio {
  guardia_id: number;
  fecha: string;
  paciente: string;
  tipo_servicio: string;
  horas: number;
  valor_hora: number;
  importe_base: number;
  importe_pagado: number;
}

export interface ResumenCuidador {
  id_cuidador: number;
  cuidador_nombre: string;
  cuidador_apellido: string;
  total_horas: number;
  total_base: number;
  total_pagado: number;
  servicios: Servicio[];
}

export interface HonorariosAdminResponse {
  success: boolean;
  data: ResumenCuidador[];
  totalGeneral: number;
  periodo: { desde: string; hasta: string };
}

export interface MisHonorariosResponse {
  success: boolean;
  data: {
    servicios: Servicio[];
    total_horas: number;
    total_base: number;
    total_pagado: number;
  };
  periodo: { desde: string; hasta: string };
}

export async function listarHonorarios(params?: {
  id_cuidador?: number;
  desde?: string;
  hasta?: string;
}): Promise<HonorariosAdminResponse> {
  try {
    const query = new URLSearchParams();
    if (params?.id_cuidador) query.set("id_cuidador", params.id_cuidador.toString());
    if (params?.desde) query.set("desde", params.desde);
    if (params?.hasta) query.set("hasta", params.hasta);

    const url = `${API_URL}/honorarios${query.toString() ? `?${query}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return { success: false, data: [], totalGeneral: 0, periodo: { desde: "", hasta: "" } };
    return await res.json();
  } catch (error) {
    console.error("listarHonorarios error:", error);
    return { success: false, data: [], totalGeneral: 0, periodo: { desde: "", hasta: "" } };
  }
}

export async function listarMisHonorarios(params?: {
  desde?: string;
  hasta?: string;
}): Promise<MisHonorariosResponse> {
  const userId = await getUserIdFromToken();
  if (!userId) {
    return {
      success: false,
      data: { servicios: [], total_horas: 0, total_base: 0, total_pagado: 0 },
      periodo: { desde: "", hasta: "" },
    };
  }

  try {
    const query = new URLSearchParams();
    if (params?.desde) query.set("desde", params.desde);
    if (params?.hasta) query.set("hasta", params.hasta);

    const url = `${API_URL}/honorarios/usuario/${userId}${query.toString() ? `?${query}` : ""}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return {
        success: false,
        data: { servicios: [], total_horas: 0, total_base: 0, total_pagado: 0 },
        periodo: { desde: "", hasta: "" },
      };
    }
    return await res.json();
  } catch (error) {
    console.error("listarMisHonorarios error:", error);
    return {
      success: false,
      data: { servicios: [], total_horas: 0, total_base: 0, total_pagado: 0 },
      periodo: { desde: "", hasta: "" },
    };
  }
}
