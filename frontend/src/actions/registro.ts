"use server";

import type { RegistroResponse } from "@/src/types/registro";

export interface DisponibilidadDia {
  dia_semana: number;   // 1=Lunes ... 7=Domingo
  hora_inicio: string;  // "HH:MM"
  hora_fin: string;     // "HH:MM"
}

// registrar un cuidador (POST /api/registro/cuidador)
export async function registrarCuidadorAction(data: {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  identificacion: string;
  telefono: string;
  direccion: string;
  edad: number;
  cbu?: string;
  cvu?: string;
  alias?: string;
  disponibilidades?: DisponibilidadDia[];
}): Promise<RegistroResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/registro/cuidador`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        data: null,
        message: result.message || "Error al registrar cuidador.",
      };
    }

    return result;
  } catch (error) {
    console.error("registrarCuidadorAction error:", error);
    return {
      success: false,
      data: null,
      message: "No se pudo conectar con el servidor.",
    };
  }
}

// registrar un familiar (POST /api/registro/familiar)
export async function registrarFamiliarAction(data: {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  identificacion: string;
  telefono: string;
  direccion: string;
  edad: number;
}): Promise<RegistroResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/registro/familiar`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        data: null,
        message: result.message || "Error al registrar familiar.",
      };
    }

    return result;
  } catch (error) {
    console.error("registrarFamiliarAction error:", error);
    return {
      success: false,
      data: null,
      message: "No se pudo conectar con el servidor.",
    };
  }
}

