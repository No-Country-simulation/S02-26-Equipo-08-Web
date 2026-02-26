"use server";
import { cookies } from "next/headers";

/**
 * Obtiene los datos del dashboard filtrados por página y término de búsqueda.
 * @param page - Número de página (default 1)
 * @param search - Término de búsqueda (opcional)
 */
export async function getDashboardData(page: number = 1, search: string = "") {
  const cookieStore = await cookies(); 
  const token = cookieStore.get("token")?.value;

  if (!token) {
    console.error("No hay token en las cookies");
    return null;
  }

  try {
    // Construimos la URL con los parámetros de búsqueda (search) y paginación (page)
    console.log("🔍 Buscando:", search, "Página:", page);
    const url = `http://localhost:8001/api/dashboard/summary?page=${page}&limit=10&search=${encodeURIComponent(search)}`;

    const res = await fetch(url, {
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