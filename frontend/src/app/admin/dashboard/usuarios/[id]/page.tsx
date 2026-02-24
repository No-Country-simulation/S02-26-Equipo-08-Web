"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { obtenerUsuario, cambiarEstadoUsuarioAction } from "@/src/actions/usuarios";
import UsuarioDetalleComponent from "@/src/components/usuarios/UsuarioDetalle";
import ConfirmModal from "@/src/components/usuarios/ConfirmModal";
import { useUser } from "@/src/context/UserContext";
import type { UsuarioDetalle } from "@/src/types/usuario";

export default function UsuarioDetallePage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const id = Number(params.id);

    const [usuario, setUsuario] = useState<UsuarioDetalle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // modal de confirmacion
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitulo, setModalTitulo] = useState("");
    const [modalMensaje, setModalMensaje] = useState("");
    const [accionPendiente, setAccionPendiente] = useState<{ nuevoEstado: number } | null>(null);
    const [loadingAccion, setLoadingAccion] = useState(false);

    useEffect(() => {
        if (isNaN(id)) {
            setError("ID de usuario inválido.");
            setLoading(false);
            return;
        }

        const cargar = async () => {
            setLoading(true);
            const result = await obtenerUsuario(id);

            if (result.success && result.data) {
                setUsuario(result.data);
            } else {
                setError(result.message);
            }
            setLoading(false);
        };

        cargar();
    }, [id]);

    const handleVolver = () => {
        router.push("/admin/dashboard/usuarios");
    };

    const handleCambiarEstado = (userId: number, nuevoEstado: number, accion: string) => {
        const nombre = usuario?.nombre && usuario?.apellido
            ? `${usuario.nombre} ${usuario.apellido}`
            : usuario?.email ?? "este usuario";
        setModalTitulo(`${accion} usuario`);
        setModalMensaje(`¿Estás seguro de que querés ${accion.toLowerCase()} a ${nombre}?`);
        setAccionPendiente({ nuevoEstado });
        setModalOpen(true);
    };

    const handleConfirmar = async () => {
        if (!accionPendiente) return;
        setLoadingAccion(true);
        const result = await cambiarEstadoUsuarioAction(
            id,
            accionPendiente.nuevoEstado,
            parseInt(user?.id ?? "0")
        );
        setLoadingAccion(false);
        setModalOpen(false);
        setAccionPendiente(null);
        if (result.success) {
            toast.success(result.message);
            // recargar datos del usuario
            const actualizado = await obtenerUsuario(id);
            if (actualizado.success && actualizado.data) {
                setUsuario(actualizado.data);
            }
        } else {
            toast.error(result.message);
        }
    };

    // estado: cargando
    if (loading) {
        return (
            <div className="min-h-screen bg-brand-secondary p-8 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent" />
                    <span className="text-slate-500">Cargando detalle del usuario...</span>
                </div>
            </div>
        );
    }

    // estado: error o no encontrado
    if (error || !usuario) {
        return (
            <div className="min-h-screen bg-brand-secondary p-8">
                <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-slate-400">
                    <UserX size={48} />
                    <p className="mt-4 text-lg font-medium">{error || "Usuario no encontrado"}</p>
                    <button
                        onClick={handleVolver}
                        className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90 transition-colors cursor-pointer"
                    >
                        Volver al listado
                    </button>
                </div>
            </div>
        );
    }

    // estado: datos cargados
    return (
        <div className="min-h-screen bg-brand-secondary p-8">
            <UsuarioDetalleComponent
                usuario={usuario}
                onBack={handleVolver}
                onCambiarEstado={handleCambiarEstado}
            />
            <ConfirmModal
                open={modalOpen}
                titulo={modalTitulo}
                mensaje={modalMensaje}
                onConfirm={handleConfirmar}
                onCancel={() => { setModalOpen(false); setAccionPendiente(null); }}
                loading={loadingAccion}
            />
        </div>
    );
}
