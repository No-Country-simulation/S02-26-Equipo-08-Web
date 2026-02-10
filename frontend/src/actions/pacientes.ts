"use server";
import { cookies } from "next/headers";

import { PatientsResponse } from "@/src/types/patient";

export async function getPatientsAction(): Promise<PatientsResponse> {

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) throw new Error("No existe token de sesión");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-token": token,
      },
      next: { revalidate: 3600 }, // Caché de 1 hora
    });

    if (!response.ok) throw new Error("Error al cargar pacientes");
    
    return await response.json();
  } catch (error) {
    console.error(error);
    return { total: 0, content: [] };
  }
}