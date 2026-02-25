"use server";
import { cookies } from "next/headers";

// Añadimos el parámetro 'page' con valor por defecto 1
export async function getDashboardData(page: number = 1) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.error("No hay token en las cookies");
    return null;
  }

  try {
    // Agregamos los query params (?page=X&limit=10) a la URL del fetch
    const res = await fetch(`http://localhost:8001/api/dashboard/summary?page=${page}&limit=10`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: 'no-store' 
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error en el fetch del dashboard:", errorText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error de conexión con el backend:", error);
    return null;
  }
}