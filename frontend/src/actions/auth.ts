"use server";

//import { useUser } from "@/context/UserContext";
import { decodeJwt } from 'jose';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = await cookies();

  // 1. Borramos TODO lo que se ve en tu captura KOKIES.png

  cookieStore.delete("token");
/*   cookieStore.delete("user_name");
  cookieStore.delete("user_role");
  cookieStore.delete("user_slug"); */

  // El resto de tu lógica de fetch al backend...
//redirect("/login");

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", 
    });
  } catch (error) {
    console.error("Error al notificar al backend");
  }

  // 2. Redirigir SIEMPRE fuera del try/catch
  redirect("/login");
}



export async function getMisDatos() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;

  try {
    // Decodificamos el payload que mostraste en TOKEN_CLAM.png
    const payload: any = decodeJwt(token);
    
    return {
      id: payload.uid,
      nameUser: payload.nameUser,
      role: payload.role,
    };
  } catch (error) {
    return null;
  }
}