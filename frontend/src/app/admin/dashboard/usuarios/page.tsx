"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Users,
    Search,
    UserCheck,
    UserX,
    Clock,
    ChevronLeft,
    ChevronRight,
    Filter,
    Eye,
} from "lucide-react";
import { listarUsuarios } from "@/src/actions/usuarios";
import type { Usuario } from "@/src/types/usuario";

// mapeo de descripciones de estado (tal como vienen de la tabla usuario_estado) a colores
const ESTADOS: Record<string, { label: string; color: string }> = {
    "Activo": { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
    "Pendiente de Aceptar": { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
    "Rechazado": { label: "Rechazado", color: "bg-red-100 text-red-700" },
    "Desactivado": { label: "Desactivado", color: "bg-slate-100 text-slate-600" },
};

// mapeo de roles
const ROLES: Record<number, string> = {
    1: "Admin",
    2: "Cuidador",
    3: "Familiar",
};

export default function UsuariosPage() {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    // filtros
    const [filtroRol, setFiltroRol] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [busquedaInput, setBusquedaInput] = useState("");

    const limit = 10;

    const cargarUsuarios = useCallback(async () => {
        setLoading(true);
        const result = await listarUsuarios({
            page,
            limit,
            rol: filtroRol || undefined,
            estado: filtroEstado || undefined,
            busqueda: busqueda || undefined,
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined,
        });

        if (result.success) {
            setUsuarios(result.data.usuarios);
            setTotal(result.data.total);
            setTotalPages(result.data.totalPages);
        }
        setLoading(false);
    }, [page, filtroRol, filtroEstado, busqueda, fechaInicio, fechaFin]);

    useEffect(() => {
        cargarUsuarios();
    }, [cargarUsuarios]);

    // cuando cambia un filtro, volvemos a la pagina 1
    const handleFiltroRol = (valor: string) => {
        setFiltroRol(valor);
        setPage(1);
    };

    const handleFiltroEstado = (valor: string) => {
        setFiltroEstado(valor);
        setPage(1);
    };

    const handleFechaInicio = (valor: string) => {
        setFechaInicio(valor);
        setPage(1);
    };

    const handleFechaFin = (valor: string) => {
        setFechaFin(valor);
        setPage(1);
    };

    const handleBuscar = () => {
        setBusqueda(busquedaInput);
        setPage(1);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleBuscar();
    };

    // contar estadisticas (estado es ahora la descripcion de la tabla usuario_estado)
    const activos = usuarios.filter((u) => u.estado === "Activo").length;
    const pendientes = usuarios.filter((u) => u.estado === "Pendiente de Aceptar").length;

    const formatFecha = (fecha: string | null) => {
        if (!fecha) return "—";
        return new Date(fecha).toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-brand-secondary p-8">
            {/* HEADER */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-brand-primary">
                        Gestión de Usuarios
                    </h1>
                    <p className="text-slate-500">
                        Visualización y filtrado de todos los usuarios del sistema
                    </p>
                </div>
            </header>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* ... KPIs se mantienen igual ... */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                            Total Usuarios
                        </p>
                        <p className="text-3xl font-bold mt-1">{total}</p>
                    </div>
                    <div className="bg-brand-secondary p-3 rounded-lg">
                        <Users className="text-brand-accent" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                            Activos
                        </p>
                        <p className="text-3xl font-bold mt-1 text-emerald-600">
                            {activos}
                        </p>
                    </div>
                    <div className="bg-brand-secondary p-3 rounded-lg">
                        <UserCheck className="text-emerald-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
                            Pendientes
                        </p>
                        <p className="text-3xl font-bold mt-1 text-amber-600">
                            {pendientes}
                        </p>
                    </div>
                    <div className="bg-brand-secondary p-3 rounded-lg">
                        <Clock className="text-amber-500" />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* FILTROS Y BUSQUEDA - Diseño mejorado */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center">
                        {/* 1. Barra de Búsqueda */}
                        <div className="relative w-full flex-1 lg:max-w-3xl">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Nombre, DNI o Email"
                                value={busquedaInput}
                                onChange={(e) => setBusquedaInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-10 pr-20 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm"
                            />
                            <button
                                onClick={handleBuscar}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-brand-accent text-white text-sm font-medium rounded-lg hover:bg-brand-accent-hover transition-colors cursor-pointer"
                            >
                                Buscar
                            </button>
                        </div>

                        {/* 2. Filtros agrupados */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-end sm:items-center">

                            {/* Grupo Fechas */}
                            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                                <span className="text-xs font-semibold text-slate-400 uppercase px-2">Fecha</span>
                                <input
                                    type="date"
                                    className="px-2 py-1.5 rounded-md text-sm text-slate-600 focus:outline-none focus:bg-slate-50"
                                    value={fechaInicio}
                                    onChange={(e) => handleFechaInicio(e.target.value)}
                                    title="Fecha Desde"
                                />
                                <span className="text-slate-300">-</span>
                                <input
                                    type="date"
                                    className="px-2 py-1.5 rounded-md text-sm text-slate-600 focus:outline-none focus:bg-slate-50"
                                    value={fechaFin}
                                    onChange={(e) => handleFechaFin(e.target.value)}
                                    title="Fecha Hasta"
                                />
                            </div>

                            {/* Separador visual */}
                            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

                            {/* Grupo Selectores */}
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="relative group w-1/2 sm:w-auto">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-primary transition-colors" size={16} />
                                    <select
                                        value={filtroRol}
                                        onChange={(e) => handleFiltroRol(e.target.value)}
                                        className="w-full sm:w-48 pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 focus:outline-none focus:border-brand-primary cursor-pointer hover:border-brand-primary/50 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="">Todos los roles</option>
                                        <option value="1">Admin</option>
                                        <option value="2">Cuidador</option>
                                        <option value="3">Familiar</option>
                                    </select>
                                </div>

                                <div className="relative group w-1/2 sm:w-auto">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400 group-hover:bg-brand-primary transition-colors"></div>
                                    <select
                                        value={filtroEstado}
                                        onChange={(e) => handleFiltroEstado(e.target.value)}
                                        className="w-full sm:w-48 pl-8 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 focus:outline-none focus:border-brand-primary cursor-pointer hover:border-brand-primary/50 transition-all shadow-sm appearance-none"
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="2">Activo</option>
                                        <option value="1">Pendiente</option>
                                        <option value="4">Desactivado</option>
                                        <option value="3">Rechazado</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABLA */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
                            <span className="ml-3 text-slate-500">Cargando usuarios...</span>
                        </div>
                    ) : usuarios.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                            <UserX size={48} />
                            <p className="mt-4 text-lg font-medium">
                                No se encontraron usuarios
                            </p>
                            <p className="text-sm">
                                Intentá ajustar los filtros de búsqueda
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                                    <th className="px-6 py-4 font-semibold">Nombre</th>
                                    <th className="px-6 py-4 font-semibold">DNI</th>
                                    <th className="px-6 py-4 font-semibold">Email</th>
                                    <th className="px-6 py-4 font-semibold">Rol</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                    <th className="px-6 py-4 font-semibold">Fecha Alta</th>
                                    <th className="px-6 py-4 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {usuarios.map((usuario) => {
                                    const estadoInfo = ESTADOS[usuario.estado] || {
                                        label: usuario.estado,
                                        color: "bg-gray-100 text-gray-600",
                                    };
                                    const rolLabel =
                                        usuario.rol || ROLES[usuario.id_rol] || "Sin rol";

                                    return (
                                        <tr
                                            key={usuario.id}
                                            className="hover:bg-slate-50/80 transition-colors group"
                                        >
                                            <td className="px-6 py-4 font-medium text-brand-primary">
                                                {usuario.nombre && usuario.apellido
                                                    ? `${usuario.nombre} ${usuario.apellido}`
                                                    : "Sin datos personales"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {usuario.identificacion || "—"}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {usuario.email}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                                    {rolLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`${estadoInfo.color} px-3 py-1 rounded-full text-xs font-bold`}
                                                >
                                                    {estadoInfo.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                {formatFecha(usuario.fecha_alta)}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-sm">
                                                <div className="flex gap-2">
                                                    <button
                                                        title="Ver detalle"
                                                        onClick={() => router.push(`/admin/dashboard/usuarios/${usuario.id}`)}
                                                        className="p-1 hover:bg-brand-secondary rounded-md text-brand-primary transition-colors cursor-pointer"
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        title="Gestionar"
                                                        className="p-1 hover:bg-brand-secondary rounded-md text-slate-600 transition-colors cursor-pointer"
                                                    >
                                                        <UserCheck size={18} />
                                                    </button>
                                                    <button
                                                        title="Deshabilitar"
                                                        className="p-1 hover:bg-red-50 rounded-md text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <UserX size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* PAGINACION */}
                {!loading && totalPages > 0 && (
                    <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                        <span>
                            Mostrando {usuarios.length} de {total} usuarios — Página {page} de{" "}
                            {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="flex items-center gap-1 px-4 py-2 bg-brand-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-brand-primary/90"
                            >
                                <ChevronLeft size={16} />
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="flex items-center gap-1 px-4 py-2 bg-brand-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-brand-primary/90"
                            >
                                Siguiente
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
