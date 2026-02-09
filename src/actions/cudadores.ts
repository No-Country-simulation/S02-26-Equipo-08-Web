"use server";

import { cookies } from "next/headers";
import { CaregiversResponse } from "@/src/types/caregiver";

export async function getCaregiversAction(): Promise<CaregiversResponse> {
 const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("No existe token de sesión");

  try {
    const response = await fetch("http://localhost:5000/api/caregivers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": token, // Reemplazar por lógica de sesión
      },
      next: { revalidate: 0 }, // Para datos de RRHH mejor no cachear mucho
    });

    if (!response.ok) throw new Error("Error al obtener cuidadores");
    return await response.json();
  } catch (error) {
    console.error(error);
    return { total: 0, content: [] };
  }
}