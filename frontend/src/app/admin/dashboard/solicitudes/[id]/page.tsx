"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ClipboardList,
  User,
  Heart,
  CalendarClock,
  Clock,
  UserCheck,
  AlertCircle,
  UserPlus,
  Search,
  X,
  CheckCircle,
  Play,
  FileCheck,
  XCircle,
} from "lucide-react";
import {
  obtenerSolicitudAdmin,
  listarCuidadoresActivos,
  listarTareas,
  asignarCuidadorAction,
  desasignarCuidadorAction,
  iniciarServicioAction,
  finalizarServicioAction,
  cancelarServicioAction,
  type SolicitudDetalle,
  type CuidadorActivo,
  type Tarea,
} from "@/src/actions/solicitudes";
import { getMisDatos } from "@/src/actions/auth";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatFecha(fecha: string) {
  try {
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return fecha;
  }
}

function formatHora(hora: string) {
  try {
    return new Date(hora).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return hora;
  }
}

function estadoColor(estado?: string) {
  if (!estado) return "bg-gray-100 text-gray-600";
  const lower = estado.toLowerCase();
  if (lower.includes("pendiente")) return "bg-amber-100 text-amber-700";
  if (lower.includes("asignad") || lower.includes("aprobad")) return "bg-blue-100 text-blue-700";
  if (lower.includes("en curso")) return "bg-purple-100 text-purple-700";
  if (lower.includes("finalizado") || lower.includes("completad")) return "bg-emerald-100 text-emerald-700";
  if (lower.includes("cancelad") || lower.includes("rechazad")) return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
}

// ─── Fila informativa ────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide sm:w-44 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-slate-700">{value}</span>
    </div>
  );
}

// ─── Card envolvente ─────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="text-brand-primary">{icon}</div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h2>
        </div>
        {action}
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}

// ─── Modal de asignación ──────────────────────────────────────────────────────

function ModalAsignar({
  pedidoId,
  cuidadores,
  tareas,
  onClose,
  onSuccess,
}: {
  pedidoId: number;
  cuidadores: CuidadorActivo[];
  tareas: Tarea[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [selectedCuidador, setSelectedCuidador] = useState<number | null>(null);
  const [selectedTarea, setSelectedTarea] = useState<number | null>(null);
  const [asignando, setAsignando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const cuidadoresFiltrados = cuidadores.filter((c) => {
    const q = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleConfirmar = async () => {
    if (!selectedCuidador || !selectedTarea) {
      setError("Debe seleccionar un acompañante y una tarea.");
      return;
    }
    setAsignando(true);
    setError(null);
    try {
      const result = await asignarCuidadorAction(pedidoId, {
        id_cuidador: selectedCuidador,
        id_tarea: selectedTarea,
      });
      if (result.success) {
        setExito(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setError(result.message);
      }
    } finally {
      setAsignando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-brand-primary flex items-center gap-2">
            <UserPlus size={20} />
            Asignar acompañante
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Selección de cuidador */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Acompañante
            </label>
            <div className="relative mb-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent"
              />
            </div>
            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-44 overflow-y-auto">
              {cuidadoresFiltrados.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">
                  {cuidadores.length === 0 ? "No hay acompañantes activos." : "Sin resultados."}
                </p>
              ) : (
                cuidadoresFiltrados.map((c) => {
                  const noDisponible = c.disponible === false;
                  return (
                    <button
                      key={c.id}
                      onClick={() => !noDisponible && setSelectedCuidador(c.id)}
                      disabled={noDisponible}
                      title={noDisponible ? "Ya tiene una asignación en ese horario" : undefined}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-2 border-b border-slate-50 last:border-0 transition-colors ${
                        noDisponible
                          ? "opacity-40 cursor-not-allowed bg-slate-50"
                          : selectedCuidador === c.id
                          ? "bg-brand-primary/10 text-brand-primary cursor-pointer"
                          : "hover:bg-slate-50 text-slate-700 cursor-pointer"
                      }`}
                    >
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="font-medium">{c.apellido}, {c.nombre}</span>
                        <span className="text-xs text-slate-400">{c.email}</span>
                      </div>
                      {noDisponible && (
                        <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                          No disponible
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Selección de tarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Tipo de tarea
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              {tareas.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTarea(t.id)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between border-b border-slate-50 last:border-0 transition-colors cursor-pointer ${
                    selectedTarea === t.id
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="font-medium">{t.descripcion}</span>
                  <span className="text-xs text-slate-400">
                    {t.moneda ?? "$"} {t.valor_hora}/h
                  </span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </p>
          )}

          {exito && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <CheckCircle size={14} />
              Acompañante asignado correctamente.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={asignando}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={asignando || !selectedCuidador || !selectedTarea || exito}
            className="px-5 py-2 text-sm font-medium bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {asignando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Asignando...
              </>
            ) : (
              <>
                <UserPlus size={15} />
                Confirmar asignación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal de finalización ────────────────────────────────────────────────────

function ModalFinalizar({
  pedidoId,
  onClose,
  onSuccess,
}: {
  pedidoId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [informe, setInforme] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleConfirmar = async () => {
    if (!informe.trim()) {
      setError("El informe es obligatorio.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const result = await finalizarServicioAction(pedidoId, informe.trim());
      if (result.success) {
        setExito(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setError(result.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-emerald-700 flex items-center gap-2">
            <FileCheck size={20} />
            Finalizar servicio
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Informe del cuidado <span className="text-red-500">*</span>
            </label>
            <textarea
              value={informe}
              onChange={(e) => setInforme(e.target.value)}
              rows={5}
              placeholder="Describe el estado del paciente, tareas realizadas, observaciones relevantes..."
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </p>
          )}

          {exito && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <CheckCircle size={14} />
              Servicio finalizado correctamente.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={enviando}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={enviando || exito}
            className="px-5 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {enviando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Finalizando...
              </>
            ) : (
              <>
                <FileCheck size={15} />
                Confirmar finalización
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal de cancelación ─────────────────────────────────────────────────────

function ModalCancelar({
  pedidoId,
  onClose,
  onSuccess,
}: {
  pedidoId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const handleConfirmar = async () => {
    setEnviando(true);
    setError(null);
    try {
      const result = await cancelarServicioAction(pedidoId, motivo.trim() || undefined);
      if (result.success) {
        setExito(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      } else {
        setError(result.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <XCircle size={20} />
            Cancelar solicitud
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <p className="text-sm text-slate-500 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
            Esta acción no se puede deshacer.
          </p>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Motivo de cancelación (opcional)
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={3}
              placeholder="Ingresá el motivo de la cancelación..."
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-500 resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <AlertCircle size={14} />
              {error}
            </p>
          )}

          {exito && (
            <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <CheckCircle size={14} />
              Solicitud cancelada.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={enviando}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Volver
          </button>
          <button
            onClick={handleConfirmar}
            disabled={enviando || exito}
            className="px-5 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {enviando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Cancelando...
              </>
            ) : (
              <>
                <XCircle size={15} />
                Confirmar cancelación
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function SolicitudDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [role, setRole] = useState<number | null>(null);
  const [solicitud, setSolicitud] = useState<SolicitudDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalFinalizar, setShowModalFinalizar] = useState(false);
  const [showModalCancelar, setShowModalCancelar] = useState(false);
  const [confirmandoDesasignar, setConfirmandoDesasignar] = useState(false);
  const [desasignando, setDesasignando] = useState(false);
  const [iniciando, setIniciando] = useState(false);

  // Datos para el modal — cargados una sola vez al montar la página
  const [cuidadores, setCuidadores] = useState<CuidadorActivo[]>([]);
  const [tareas, setTareas] = useState<Tarea[]>([]);

  // Rol del usuario autenticado
  useEffect(() => {
    getMisDatos().then((data) => {
      if (data) setRole(Number(data.role));
    });
  }, []);

  // Datos necesarios para el modal de asignación
  useEffect(() => {
    if (id) listarCuidadoresActivos(id).then(setCuidadores);
    listarTareas().then(setTareas);
  }, [id]);

  // Solicitud
  const cargar = useCallback(async () => {
    if (isNaN(id)) {
      setError("ID de solicitud inválido.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await obtenerSolicitudAdmin(id);
      if (result.success && result.data) {
        setSolicitud(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Error al cargar la solicitud.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleVolver = () => router.push("/admin/dashboard/solicitudes");

  const handleDesasignar = async () => {
    setDesasignando(true);
    try {
      const result = await desasignarCuidadorAction(id);
      if (result.success) {
        setConfirmandoDesasignar(false);
        await cargar();
        listarCuidadoresActivos(id).then(setCuidadores);
      } else {
        setError(result.message);
        setConfirmandoDesasignar(false);
      }
    } finally {
      setDesasignando(false);
    }
  };

  const handleIniciar = async () => {
    setIniciando(true);
    try {
      const result = await iniciarServicioAction(id);
      if (result.success) {
        await cargar();
      } else {
        setError(result.message);
      }
    } finally {
      setIniciando(false);
    }
  };

  const esAdmin    = role === 1;
  const esCuidador = role === 2;
  const esFamiliar = role === 3;
  const esPendiente  = Number(solicitud?.id_pedido_estado) === 1;
  const esAsignado   = Number(solicitud?.id_pedido_estado) === 3;
  const esEnCurso    = Number(solicitud?.id_pedido_estado) === 4;
  const esFinalizado = Number(solicitud?.id_pedido_estado) === 5;
  const esCancelado  = Number(solicitud?.id_pedido_estado) === 6;

  // ── Botones de acción para la SectionCard de asignación ──────────────────────
  const accionAsignacion = (() => {
    if (!solicitud?.asignacion_id) return undefined;

    // Admin — estado Asignado (3): Iniciar + Cancelar + Desasignar
    if (esAdmin && esAsignado) {
      return (
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={handleIniciar}
            disabled={iniciando}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play size={13} />
            {iniciando ? "Iniciando..." : "Iniciar"}
          </button>
          <button
            onClick={() => setShowModalCancelar(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <XCircle size={13} />
            Cancelar
          </button>
          {confirmandoDesasignar ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">¿Eliminar asignación?</span>
              <button
                onClick={handleDesasignar}
                disabled={desasignando}
                className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50"
              >
                {desasignando ? "Eliminando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setConfirmandoDesasignar(false)}
                disabled={desasignando}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                No
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmandoDesasignar(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={13} />
              Desasignar
            </button>
          )}
        </div>
      );
    }

    // Admin — estado En curso (4): Finalizar + Cancelar
    if (esAdmin && esEnCurso) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModalFinalizar(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <FileCheck size={13} />
            Finalizar
          </button>
          <button
            onClick={() => setShowModalCancelar(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <XCircle size={13} />
            Cancelar
          </button>
        </div>
      );
    }

    // Cuidador — estado Asignado (3): Iniciar + Cancelar
    if (esCuidador && esAsignado) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={handleIniciar}
            disabled={iniciando}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Play size={13} />
            {iniciando ? "Iniciando..." : "Iniciar servicio"}
          </button>
          <button
            onClick={() => setShowModalCancelar(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <XCircle size={13} />
            Cancelar
          </button>
        </div>
      );
    }

    // Cuidador — estado En curso (4): Finalizar + Cancelar
    if (esCuidador && esEnCurso) {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModalFinalizar(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            <FileCheck size={13} />
            Finalizar con informe
          </button>
          <button
            onClick={() => setShowModalCancelar(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
          >
            <XCircle size={13} />
            Cancelar
          </button>
        </div>
      );
    }

    // Familiar — estado Asignado (3) o En curso (4): solo Cancelar
    if (esFamiliar && (esAsignado || esEnCurso)) {
      return (
        <button
          onClick={() => setShowModalCancelar(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
        >
          <XCircle size={13} />
          Cancelar solicitud
        </button>
      );
    }

    return undefined;
  })();

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-secondary p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent" />
          <span className="text-slate-500">Cargando solicitud...</span>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !solicitud) {
    return (
      <div className="min-h-screen bg-brand-secondary p-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-20 text-slate-400">
          <AlertCircle size={48} />
          <p className="mt-4 text-lg font-medium">{error || "Solicitud no encontrada"}</p>
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

  // ── Datos cargados ──
  return (
    <div className="min-h-screen bg-brand-secondary p-8">
      {showModal && (
        <ModalAsignar
          pedidoId={id}
          cuidadores={cuidadores}
          tareas={tareas}
          onClose={() => setShowModal(false)}
          onSuccess={cargar}
        />
      )}
      {showModalFinalizar && (
        <ModalFinalizar
          pedidoId={id}
          onClose={() => setShowModalFinalizar(false)}
          onSuccess={cargar}
        />
      )}
      {showModalCancelar && (
        <ModalCancelar
          pedidoId={id}
          onClose={() => setShowModalCancelar(false)}
          onSuccess={cargar}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleVolver}
              className="p-2 rounded-xl hover:bg-white border border-slate-200 text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
              title="Volver al listado"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-brand-primary flex items-center gap-2">
                <ClipboardList size={24} />
                Solicitud #{solicitud.id}
              </h1>
              <p className="text-slate-500 text-sm">
                Creada el {formatFecha(solicitud.fecha_del_servicio)}
              </p>
            </div>
          </div>
          <span className={`text-sm font-semibold px-4 py-2 rounded-full ${estadoColor(solicitud.estado)}`}>
            {solicitud.estado}
          </span>
        </div>

        {/* Datos de la solicitud */}
        <SectionCard icon={<CalendarClock size={18} />} title="Datos de la solicitud">
          <InfoRow label="Fecha del servicio" value={formatFecha(solicitud.fecha_del_servicio)} />
          <InfoRow label="Hora de inicio" value={formatHora(solicitud.hora_inicio)} />
          <InfoRow label="Horas solicitadas" value={`${solicitud.cantidad_horas_solicitadas}h`} />
          <InfoRow label="Estado" value={solicitud.estado} />
          {solicitud.observaciones && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                Observaciones
              </p>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl px-4 py-3 leading-relaxed">
                {solicitud.observaciones}
              </p>
            </div>
          )}
        </SectionCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paciente */}
          <SectionCard icon={<Heart size={18} />} title="Paciente">
            <InfoRow
              label="Nombre"
              value={`${solicitud.paciente_nombre} ${solicitud.paciente_apellido}`}
            />
            {solicitud.paciente_diagnostico && (
              <InfoRow label="Diagnóstico" value={solicitud.paciente_diagnostico} />
            )}
            {solicitud.paciente_obra_social && (
              <InfoRow label="Obra social" value={solicitud.paciente_obra_social} />
            )}
            {solicitud.paciente_nro_afiliado && (
              <InfoRow label="Nro. afiliado" value={solicitud.paciente_nro_afiliado} />
            )}
          </SectionCard>

          {/* Familiar */}
          <SectionCard icon={<User size={18} />} title="Familiar solicitante">
            <InfoRow
              label="Nombre"
              value={`${solicitud.familiar_nombre} ${solicitud.familiar_apellido}`}
            />
            {solicitud.familiar_identificacion && (
              <InfoRow label="DNI" value={solicitud.familiar_identificacion} />
            )}
            <InfoRow label="Email" value={solicitud.familiar_email} />
            {solicitud.familiar_telefono && (
              <InfoRow label="Teléfono" value={solicitud.familiar_telefono} />
            )}
            {solicitud.parentesco && (
              <InfoRow label="Parentesco" value={solicitud.parentesco} />
            )}
          </SectionCard>
        </div>

        {/* Asignación */}
        {solicitud.asignacion_id ? (
          <SectionCard
            icon={<UserCheck size={18} />}
            title="Asignación de acompañante"
            action={accionAsignacion}
          >
            <InfoRow
              label="Acompañante"
              value={
                solicitud.cuidador_nombre
                  ? `${solicitud.cuidador_nombre} ${solicitud.cuidador_apellido ?? ""}`
                  : undefined
              }
            />
            {solicitud.cuidador_email && (
              <InfoRow label="Email" value={solicitud.cuidador_email} />
            )}
            {solicitud.tarea_descripcion && (
              <InfoRow label="Tarea asignada" value={solicitud.tarea_descripcion} />
            )}
            {solicitud.valor_hora != null && (
              <InfoRow
                label="Valor por hora"
                value={`${solicitud.moneda ?? "$"} ${solicitud.valor_hora}`}
              />
            )}
            {solicitud.fecha_asignacion && (
              <InfoRow label="Fecha asignación" value={formatFecha(solicitud.fecha_asignacion)} />
            )}
            {solicitud.asignado_por_email && (
              <InfoRow label="Asignado por" value={solicitud.asignado_por_email} />
            )}
          </SectionCard>
        ) : (
          <SectionCard
            icon={<UserCheck size={18} />}
            title="Asignación de acompañante"
            action={
              esAdmin && esPendiente ? (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors cursor-pointer"
                >
                  <UserPlus size={13} />
                  Asignar acompañante
                </button>
              ) : (esFamiliar && (esAsignado || esEnCurso)) ? (
                <button
                  onClick={() => setShowModalCancelar(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <XCircle size={13} />
                  Cancelar solicitud
                </button>
              ) : undefined
            }
          >
            <div className="flex items-center gap-3 py-4 text-slate-400">
              <Clock size={20} />
              <span className="text-sm">
                Sin acompañante asignado aún.
                {esAdmin && esPendiente && (
                  <span className="ml-1 text-brand-primary font-medium">
                    Use el botón para asignar uno.
                  </span>
                )}
              </span>
            </div>
          </SectionCard>
        )}

        {/* Informe del cuidado (solo cuando está finalizado) */}
        {esFinalizado && solicitud.informe_cuidado && (
          <SectionCard icon={<FileCheck size={18} />} title="Informe del cuidado">
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed bg-emerald-50/50 rounded-xl px-4 py-3">
              {solicitud.informe_cuidado}
            </p>
          </SectionCard>
        )}

        {/* Motivo de cancelación (solo cuando está cancelado) */}
        {esCancelado && (
          <SectionCard icon={<XCircle size={18} />} title="Cancelación">
            {solicitud.motivo_cancelacion ? (
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {solicitud.motivo_cancelacion}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">Sin motivo registrado.</p>
            )}
          </SectionCard>
        )}

      </div>
    </div>
  );
}
