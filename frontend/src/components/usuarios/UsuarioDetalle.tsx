"use client";
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    CreditCard,
    FileCheck,
    Users,
    UserX,
    Settings,
    Clock,
    AlertTriangle,
} from "lucide-react";
import type { UsuarioDetalle, DatosCuidador, DatosFamiliar } from "@/src/types/usuario";

// mapeo de estados a etiquetas y colores (consistente con el listado)
const ESTADOS: Record<string, { label: string; color: string }> = {
    A: { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
    PA: { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
    D: { label: "Deshabilitado", color: "bg-red-100 text-red-700" },
    R: { label: "Rechazado", color: "bg-slate-100 text-slate-600" },
};

const ROLES: Record<number, { label: string; color: string }> = {
    1: { label: "Administrador", color: "bg-purple-100 text-purple-700" },
    2: { label: "Cuidador", color: "bg-blue-100 text-blue-700" },
    3: { label: "Familiar", color: "bg-teal-100 text-teal-700" },
};

interface UsuarioDetalleProps {
    usuario: UsuarioDetalle;
    onBack?: () => void;
    // callbacks para acciones futuras (deshabilitar, gestionar, etc.)
    onDeshabilitar?: (id: number) => void;
    onGestionar?: (id: number) => void;
}

function formatFecha(fecha: string | null): string {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function formatFechaCorta(fecha: string | null): string {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

// seccion informativa reutilizable
function InfoItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 py-3">
            <div className="bg-slate-100 p-2 rounded-lg shrink-0">
                <Icon size={16} className="text-slate-500" />
            </div>
            <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">{label}</p>
                <p className="text-sm text-brand-primary font-medium mt-0.5">{value}</p>
            </div>
        </div>
    );
}

// seccion de datos del cuidador
function SeccionCuidador({ datos }: { datos: DatosCuidador }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-500" />
                Datos de Cuidador
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <InfoItem icon={CreditCard} label="CBU" value={datos.cbu || "No registrado"} />
                <InfoItem icon={CreditCard} label="CVU" value={datos.cvu || "No registrado"} />
                <InfoItem icon={CreditCard} label="Alias" value={datos.alias || "No registrado"} />
                <InfoItem
                    icon={FileCheck}
                    label="Documentación"
                    value={datos.con_documentacion ? "Documentación cargada" : "Sin documentación"}
                />
                <InfoItem icon={Calendar} label="Fecha de ingreso" value={formatFechaCorta(datos.fecha_ingreso)} />
                <InfoItem icon={Calendar} label="Fecha de autorización" value={formatFechaCorta(datos.fecha_autorizado)} />
            </div>
        </div>
    );
}

// seccion de datos del familiar (con pacientes vinculados)
function SeccionFamiliar({ datos }: { datos: DatosFamiliar[] }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center gap-2">
                <Users size={20} className="text-teal-500" />
                Datos de Familiar — Pacientes vinculados
            </h3>
            {datos.length === 0 ? (
                <p className="text-slate-400 text-sm">No hay pacientes vinculados.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 uppercase text-xs">
                                <th className="py-3 px-4 font-semibold">Paciente</th>
                                <th className="py-3 px-4 font-semibold">DNI</th>
                                <th className="py-3 px-4 font-semibold">Parentesco</th>
                                <th className="py-3 px-4 font-semibold">Diagnóstico</th>
                                <th className="py-3 px-4 font-semibold">Obra Social</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {datos.map((f, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="py-3 px-4 font-medium text-brand-primary">
                                        {f.nombre_paciente && f.apellido_paciente
                                            ? `${f.nombre_paciente} ${f.apellido_paciente}`
                                            : "—"}
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">{f.dni_paciente || "—"}</td>
                                    <td className="py-3 px-4 text-slate-600">{f.parentesco || "—"}</td>
                                    <td className="py-3 px-4 text-slate-600">{f.diagnostico || "—"}</td>
                                    <td className="py-3 px-4 text-slate-600">{f.obra_social || "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default function UsuarioDetalleComponent({ usuario, onBack, onDeshabilitar, onGestionar }: UsuarioDetalleProps) {
    const estadoInfo = ESTADOS[usuario.estado] || { label: usuario.estado, color: "bg-gray-100 text-gray-600" };
    const rolInfo = ROLES[usuario.id_rol] || { label: "Sin rol", color: "bg-gray-100 text-gray-600" };
    const nombreCompleto = usuario.nombre && usuario.apellido
        ? `${usuario.nombre} ${usuario.apellido}`
        : "Sin datos personales";

    return (
        <div className="space-y-6">
            {/* HEADER con boton volver */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors group cursor-pointer"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Volver al listado</span>
                    </button>
                )}

                {/* Acciones rapidas (preparadas para futuras tareas) */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onGestionar?.(usuario.id)}
                        disabled={!onGestionar}
                        title="Gestionar usuario"
                        className="flex items-center gap-2 px-4 py-2 bg-brand-accent text-white rounded-lg text-sm font-medium hover:bg-brand-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <Settings size={16} />
                        Gestionar
                    </button>
                    <button
                        onClick={() => onDeshabilitar?.(usuario.id)}
                        disabled={!onDeshabilitar}
                        title="Deshabilitar usuario"
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <UserX size={16} />
                        Deshabilitar
                    </button>
                </div>
            </div>

            {/* CARD PRINCIPAL — Identidad */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        {/* Avatar con iniciales */}
                        <div className="w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0">
                            {usuario.nombre && usuario.apellido
                                ? `${usuario.nombre[0]}${usuario.apellido[0]}`
                                : "?"}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-brand-primary">{nombreCompleto}</h2>
                            <p className="text-slate-500 text-sm">ID: {usuario.id}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <span className={`${rolInfo.color} px-4 py-1.5 rounded-full text-xs font-bold`}>
                            {rolInfo.label}
                        </span>
                        <span className={`${estadoInfo.color} px-4 py-1.5 rounded-full text-xs font-bold`}>
                            {estadoInfo.label}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 border-t border-slate-100 pt-4">
                    <InfoItem icon={Mail} label="Email" value={usuario.email} />
                    <InfoItem icon={Phone} label="Teléfono" value={usuario.telefono || "No registrado"} />
                    <InfoItem icon={Shield} label="DNI / Identificación" value={usuario.identificacion || "No registrado"} />
                    <InfoItem icon={MapPin} label="Dirección" value={usuario.direccion || "No registrada"} />
                    <InfoItem icon={Users} label="Edad" value={usuario.edad ? `${usuario.edad} años` : "No registrada"} />
                </div>
            </div>

            {/* CARD — Datos de cuenta */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-brand-primary mb-4 flex items-center gap-2">
                    <Clock size={20} className="text-slate-400" />
                    Datos de Cuenta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
                    <InfoItem icon={Calendar} label="Fecha de alta" value={formatFecha(usuario.fecha_alta)} />
                    <InfoItem icon={Clock} label="Último login" value={formatFecha(usuario.fecha_ultimo_login)} />
                    <InfoItem
                        icon={AlertTriangle}
                        label="Intentos de login fallidos"
                        value={usuario.intentos_login.toString()}
                    />
                    {usuario.fecha_deshabilitado && (
                        <InfoItem
                            icon={UserX}
                            label="Fecha de deshabilitación"
                            value={formatFecha(usuario.fecha_deshabilitado)}
                        />
                    )}
                </div>
            </div>

            {/* CARD CONDICIONAL — Datos segun rol */}
            {usuario.id_rol === 2 && usuario.datosRol && !Array.isArray(usuario.datosRol) && (
                <SeccionCuidador datos={usuario.datosRol as DatosCuidador} />
            )}

            {usuario.id_rol === 3 && usuario.datosRol && Array.isArray(usuario.datosRol) && (
                <SeccionFamiliar datos={usuario.datosRol as DatosFamiliar[]} />
            )}
        </div>
    );
}
