// acciones para el modulo de usuarios
import type { ListarUsuariosResponse, UsuarioDetalleResponse } from "@/src/types/usuario";

interface ListarUsuariosParams {
    page?: number;
    limit?: number;
    rol?: string;
    estado?: string;
    busqueda?: string;
    fechaInicio?: string;
    fechaFin?: string;
}

export async function listarUsuarios(params: ListarUsuariosParams = {}): Promise<ListarUsuariosResponse> {
    const { page = 1, limit = 10, rol, estado, busqueda, fechaInicio, fechaFin } = params;

    const queryParams = new URLSearchParams();
    queryParams.set("page", page.toString());
    queryParams.set("limit", limit.toString());
    if (rol) queryParams.set("rol", rol);
    if (estado) queryParams.set("estado", estado);
    if (busqueda) queryParams.set("busqueda", busqueda);
    if (fechaInicio) queryParams.set("fechaInicio", fechaInicio);
    if (fechaFin) queryParams.set("fechaFin", fechaFin);

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/listar?${queryParams.toString()}`,
            { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Error al obtener usuarios");

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("listarUsuarios error:", error);
        return {
            success: false,
            data: { usuarios: [], total: 0, page: 1, totalPages: 0, limit: 10 },
            message: "Error al conectar con el servidor.",
        };
    }
}

// obtener detalle completo de un usuario por su id
export async function obtenerUsuario(id: number): Promise<UsuarioDetalleResponse> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/usuarios/${id}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            if (res.status === 404) {
                return { success: false, data: null, message: "Usuario no encontrado." };
            }
            throw new Error("Error al obtener el usuario");
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("obtenerUsuario error:", error);
        return {
            success: false,
            data: null,
            message: "Error al conectar con el servidor.",
        };
    }
}
