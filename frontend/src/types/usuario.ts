// tipos para el modulo de usuarios

export interface Usuario {
    id: number;
    email: string;
    id_rol: number;
    rol: string | null;
    estado: string;
    activo: number;
    fecha_alta: string | null;
    nombre: string | null;
    apellido: string | null;
    identificacion: string | null;
    telefono: string | null;
}

// datos especificos del cuidador
export interface DatosCuidador {
    id_cuidador: number;
    cbu: string | null;
    cvu: string | null;
    alias: string | null;
    con_documentacion: number;
    fecha_ingreso: string | null;
    fecha_autorizado: string | null;
}

// datos de familiar con su paciente vinculado
export interface DatosFamiliar {
    id_familiar: number;
    id_parentesco: number;
    parentesco: string | null;
    id_paciente: number;
    nombre_paciente: string | null;
    apellido_paciente: string | null;
    dni_paciente: string | null;
    diagnostico: string | null;
    obra_social: string | null;
}

// detalle completo de un usuario (respuesta de GET /usuarios/:id)
export interface UsuarioDetalle {
    id: number;
    email: string;
    id_rol: number;
    rol: string | null;
    estado: string;
    activo: number;
    fecha_alta: string | null;
    fecha_ultimo_login: string | null;
    intentos_login: number;
    fecha_deshabilitado: string | null;
    nombre: string | null;
    apellido: string | null;
    identificacion: string | null;
    direccion: string | null;
    telefono: string | null;
    edad: number | null;
    // datos especificos segun el rol:
    // - si es cuidador (rol 2): DatosCuidador
    // - si es familiar (rol 3): DatosFamiliar[] (puede tener varios pacientes)
    // - si es admin (rol 1): null
    datosRol: DatosCuidador | DatosFamiliar[] | null;
}

export interface UsuarioDetalleResponse {
    success: boolean;
    data: UsuarioDetalle | null;
    message: string;
}

export interface ListarUsuariosResponse {
    success: boolean;
    data: {
        usuarios: Usuario[];
        total: number;
        page: number;
        totalPages: number;
        limit: number;
    };
    message: string;
}
