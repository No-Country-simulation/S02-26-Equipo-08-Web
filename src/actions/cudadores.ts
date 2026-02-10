"use server";

import { cookies } from "next/headers";
import { CaregiversResponse } from "@/src/types/caregiver";

import { revalidatePath } from "next/cache";

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



/* 
export async function createCaregiverAction(formData: any) {
   const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("No existe token de sesión");

  const response = await fetch("http://localhost:5000/api/caregivers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-token": token,
    },
    body: JSON.stringify(formData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.msg || "Error al crear el cuidador");
  }

  // Limpiamos la caché de la lista de cuidadores y volvemos
 // revalidatePath("/admin/dashboard/cuidadores");
  return { success: true };
}
 */



export async function createCaregiverAction(data: any) {

   const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("No existe token de sesión");
  try {
    const response = await fetch("http://localhost:5000/api/caregivers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-token": token, // Extraer de cookies en producción
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return { error: result.msg || "Error en el servidor" };
    }

    revalidatePath("/admin/dashboard/cuidadores");
    return { success: true };
  } catch (err) {
    return { error: "No se pudo conectar con el servidor" };
  }
}