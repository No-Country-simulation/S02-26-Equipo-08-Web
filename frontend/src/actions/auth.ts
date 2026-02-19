"use server"; // Indica que este código solo se ejecuta en el servidor

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJwt } from 'jose'; // Asegúrate de tener instalada esta librería (npm install jose)

/**
 * Lógica para procesar el inicio de sesión
 */
export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // Usamos la variable de tu .env.local que apunta al puerto 8001
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Si el backend (8001) rechaza los datos, devolvemos el mensaje de error
      return { error: data.message || "Credenciales incorrectas" };
    }

    // Si el login es exitoso, guardamos el token en una cookie segura
    const cookieStore = await cookies();
    cookieStore.set("token", data.token, {
      httpOnly: true, // Impide que JavaScript del cliente acceda al token (más seguro)
      //secure: process.env.NODE_ENV === "production",
      secure: false,
      maxAge: 60 * 60 * 8, // 8 horas
      path: "/",
    });

  } catch (error) {
    console.error("Error de conexión con el backend:", error);
    return { error: "No se pudo conectar con el servidor central (8001)" };
  }

  // Redirigimos al usuario al dashboard después de un login exitoso
  redirect("/admin/dashboard");
}

/**
 * Función para obtener los datos del usuario logueado
 */
export async function getMisDatos() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    // Decodificamos el token para extraer el nombre y el rol
    const payload: any = decodeJwt(token);
    return {
      id: payload.id,
      role: payload.id_rol,
      nameUser: payload.nombre_usuario,
      nameRole: payload.rol_descripcion
    };
  } catch (error) {
    return null;
  }
}

/**
 * Lógica para cerrar sesión
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}