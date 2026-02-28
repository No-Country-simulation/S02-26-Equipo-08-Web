"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  crearSolicitud,
  listarMisSolicitudes,
  listarSolicitudesAdmin,
  listarMisAsignaciones,
  type Solicitud,
  type SolicitudAdmin,
  type AsignacionCuidador,
} from "@/src/actions/solicitudes";
import {
  listarMisPacientes,
  type Paciente,
} from "@/src/actions/pacientes";
import {
  CalendarClock,
  Clock,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  User,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Briefcase,
  Stethoscope,
  UserPlus,
} from "lucide-react";
import { getMisDatos } from "@/src/actions/auth";

// ─── Vista Admin ────────────────────────────────────────────────────────────

function estadoColorAdmin(estado?: string) {
  if (!estado) return "bg-gray-100 text-gray-600";
  const lower = estado.toLowerCase();
  if (lower.includes("pendiente")) return "bg-amber-100 text-amber-700";
  if (lower.includes("asignad") || lower.includes("aprobad")) return "bg-blue-100 text-blue-700";
  if (lower.includes("en curso")) return "bg-purple-100 text-purple-700";
  if (lower.includes("finalizado") || lower.includes("completad")) return "bg-emerald-100 text-emerald-700";
  if (lower.includes("cancelad") || lower.includes("rechazad")) return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
}

function formatFechaAdmin(fecha: string) {
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

function formatHoraAdmin(hora: string) {
  try {
    const d = new Date(hora);
    return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  } catch {
    return hora;
  }
}

function SolicitudesAdminView() {
  const router = useRouter();

  const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10;

  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaInput, setBusquedaInput] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const result = await listarSolicitudesAdmin({
        page,
        limit,
        estado: filtroEstado || undefined,
        busqueda: busqueda || undefined,
        fechaInicio: fechaInicio || undefined,
        fechaFin: fechaFin || undefined,
      });
      if (result.success) {
        setSolicitudes(result.data.solicitudes);
        setTotal(result.data.total);
        setTotalPages(result.data.totalPages);
      } else {
        setErrorMsg(result.message || "Error al cargar solicitudes.");
        setSolicitudes([]);
        setTotal(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("cargarSolicitudes error:", err);
      setErrorMsg("Error al cargar solicitudes. Intentá de nuevo.");
      setSolicitudes([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, filtroEstado, busqueda, fechaInicio, fechaFin]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

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

  return (
    <div className="min-h-screen bg-brand-secondary p-8">
      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={cargarSolicitudes}
            className="flex-shrink-0 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary flex items-center gap-2">
            <ClipboardList size={28} />
            Solicitudes de Acompañamiento
          </h1>
          <p className="text-slate-500">
            {total} solicitud{total !== 1 ? "es" : ""} en el sistema
          </p>
        </div>
      </header>

      {/* TABLA CON FILTROS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* FILTROS */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col lg:flex-row gap-5 justify-between items-start lg:items-center">
            {/* Búsqueda */}
            <div className="relative w-full flex-1 lg:max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Paciente o familiar..."
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

            {/* Filtros agrupados */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-end sm:items-center">
              {/* Rango fechas */}
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

              <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

              {/* Select estado */}
              <div className="relative group">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-brand-primary transition-colors"
                  size={16}
                />
                <select
                  value={filtroEstado}
                  onChange={(e) => handleFiltroEstado(e.target.value)}
                  className="w-full sm:w-52 pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 focus:outline-none focus:border-brand-primary cursor-pointer hover:border-brand-primary/50 transition-all shadow-sm appearance-none"
                >
                  <option value="">Todos los estados</option>
                  <option value="1">Pendiente</option>
                  <option value="3">Asignado</option>
                  <option value="4">En curso</option>
                  <option value="5">Finalizado</option>
                  <option value="6">Cancelado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent"></div>
              <span className="ml-3 text-slate-500">Cargando solicitudes...</span>
            </div>
          ) : solicitudes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <ClipboardList size={48} />
              <p className="mt-4 text-lg font-medium">No se encontraron solicitudes</p>
              <p className="text-sm">Intentá ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                  <th className="px-4 py-4 font-semibold">#</th>
                  <th className="px-4 py-4 font-semibold">Paciente</th>
                  <th className="px-4 py-4 font-semibold">Familiar</th>
                  <th className="px-4 py-4 font-semibold">Fecha</th>
                  <th className="px-4 py-4 font-semibold">Hora</th>
                  <th className="px-4 py-4 font-semibold">Horas</th>
                  <th className="px-4 py-4 font-semibold">Estado</th>
                  <th className="px-4 py-4 font-semibold">Acompañante</th>
                  <th className="px-4 py-4 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solicitudes.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-4 text-slate-400 text-sm font-mono">{s.id}</td>
                    <td className="px-4 py-4 font-medium text-brand-primary">
                      {s.paciente_nombre} {s.paciente_apellido}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      <div>{s.familiar_nombre} {s.familiar_apellido}</div>
                      <div className="text-xs text-slate-400">{s.familiar_email}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-sm">
                      {formatFechaAdmin(s.fecha_del_servicio)}
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-sm">
                      {formatHoraAdmin(s.hora_inicio)}
                    </td>
                    <td className="px-4 py-4 text-slate-600 text-sm">
                      {s.cantidad_horas_solicitadas}h
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColorAdmin(s.estado)}`}>
                        {s.estado || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      {s.cuidador_nombre ? (
                        <span className="text-slate-700">
                          {s.cuidador_nombre} {s.cuidador_apellido}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          title="Ver detalle"
                          onClick={() => router.push(`/admin/dashboard/solicitudes/${s.id}`)}
                          className="p-1 hover:bg-brand-secondary rounded-md text-brand-primary transition-colors cursor-pointer"
                        >
                          <Eye size={18} />
                        </button>
                        {Number(s.id_pedido_estado) === 1 && !s.cuidador_nombre && (
                          <button
                            title="Asignar acompañante"
                            onClick={() => router.push(`/admin/dashboard/solicitudes/${s.id}`)}
                            className="p-1 hover:bg-amber-50 rounded-md text-amber-600 transition-colors cursor-pointer"
                          >
                            <UserPlus size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINACIÓN */}
        {!loading && totalPages > 0 && (
          <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
            <span>
              Mostrando {solicitudes.length} de {total} solicitudes — Página {page} de {totalPages}
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

// ─── Vista Familiar (sin cambios) ────────────────────────────────────────────

function SolicitudesFamiliarView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pacienteIdParam = searchParams.get("pacienteId");

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [showForm, setShowForm] = useState(!!pacienteIdParam);

  const [form, setForm] = useState({
    id_paciente: pacienteIdParam ? parseInt(pacienteIdParam) : 0,
    fecha_del_servicio: "",
    hora_inicio: "",
    hora_fin: "",
    observaciones: "",
  });

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [pacs, sols] = await Promise.all([
        listarMisPacientes(),
        listarMisSolicitudes(),
      ]);
      setPacientes(pacs);
      setSolicitudes(sols);
      if (pacs.length === 1 && !form.id_paciente) {
        setForm((f) => ({ ...f, id_paciente: pacs[0].id }));
      }
    } catch (err) {
      console.error("cargarDatos error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  /*
  const calcularHoras = (inicio: string, fin: string): number => {
    if (!inicio || !fin) return 0;
    const [hi, mi] = inicio.split(":").map(Number);
    const [hf, mf] = fin.split(":").map(Number);
    const diff = (hf * 60 + mf - hi * 60 - mi) / 60;


    return Math.max(0, Math.round(diff * 100) / 100);
  };
  */
  
  const calcularHoras = (inicio: string, fin: string): number => {
  if (!inicio || !fin) return 0;
  
  const [hi, mi] = inicio.split(":").map(Number);
  const [hf, mf] = fin.split(":").map(Number);
  
  // 1. Calculamos la diferencia base en minutos
  let diffMinutos = (hf * 60 + mf) - (hi * 60 + mi);
  
  // 2. Si es negativo, sumamos los minutos de un día completo (24 * 60 = 1440)
  if (diffMinutos < 0) {
    diffMinutos += 1440;
  }
  
    // 3. Convertimos a horas y redondeamos
    const diff = diffMinutos / 60;
    return Math.round(diff * 100) / 100;
  };
  

  const hoyISO = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!form.id_paciente) {
      setMensaje({ tipo: "error", texto: "Seleccioná un familiar." });
      return;
    }
    if (!form.fecha_del_servicio) {
      setMensaje({ tipo: "error", texto: "Seleccioná la fecha del servicio." });
      return;
    }
    if (!form.hora_inicio || !form.hora_fin) {
      setMensaje({ tipo: "error", texto: "Completá la hora de inicio y fin." });
      return;
    }
    const horas = calcularHoras(form.hora_inicio, form.hora_fin);
    if (horas <= 0) {
      setMensaje({ tipo: "error", texto: "La hora de fin debe ser posterior a la de inicio." });
      return;
    }

    setEnviando(true);
    setMensaje(null);

    const result = await crearSolicitud({
      id_paciente: form.id_paciente,
      fecha_del_servicio: form.fecha_del_servicio,
      hora_inicio: form.hora_inicio,
      cantidad_horas_solicitadas: horas,
      observaciones: form.observaciones || undefined,
    });

    if (result.success) {
      setMensaje({ tipo: "ok", texto: result.message });
      setForm({ id_paciente: 0, fecha_del_servicio: "", hora_inicio: "", hora_fin: "", observaciones: "" });
      setShowForm(false);
      cargarDatos();
    } else {
      setMensaje({ tipo: "error", texto: result.message });
    }
    setEnviando(false);
  };

  const formatFecha = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const formatHora = (hora: string) => {
    try {
      const d = new Date(hora);
      return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return hora;
    }
  };

  const estadoColor = (estado?: string) => {
    if (!estado) return "bg-gray-100 text-gray-600";
    const lower = estado.toLowerCase();
    if (lower.includes("pendiente")) return "bg-amber-100 text-amber-700";
    if (lower.includes("aprobad") || lower.includes("asignad")) return "bg-emerald-100 text-emerald-700";
    if (lower.includes("cancelad") || lower.includes("rechazad")) return "bg-red-100 text-red-600";
    return "bg-blue-100 text-blue-700";
  };

  const inputStyle =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";
  const labelStyle = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarClock size={24} className="text-blue-500" />
            Mis Solicitudes
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Solicitá acompañamiento para tus familiares
          </p>
        </div>
        {!showForm && pacientes.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Send size={16} />
            Nueva solicitud
          </button>
        )}
      </div>

      {/* Aviso si no tiene pacientes */}
      {pacientes.length === 0 && (
        <div className="text-center py-12 bg-amber-50 rounded-2xl border border-amber-100">
          <User size={36} className="mx-auto text-amber-400 mb-3" />
          <p className="text-amber-700 font-medium">Primero necesitás registrar un familiar</p>
          <p className="text-amber-500 text-sm mt-1">Andá a &quot;Mis Familiares&quot; para agregar uno.</p>
        </div>
      )}

      {/* Mensaje */}
      {mensaje && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
            mensaje.tipo === "ok"
              ? "bg-emerald-50 border border-emerald-100 text-emerald-700"
              : "bg-red-50 border border-red-100 text-red-600"
          }`}
        >
          {mensaje.tipo === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {mensaje.texto}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Nueva solicitud de acompañamiento</h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
            >
              Cancelar
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Paciente */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>Familiar *</label>
              <div className="relative">
                <select
                  className={`${inputStyle} appearance-none pr-10`}
                  value={form.id_paciente}
                  onChange={(e) => setForm({ ...form, id_paciente: parseInt(e.target.value) })}
                >
                  <option value={0}>Seleccioná un familiar</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} {p.apellido} — DNI: {p.identificacion}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className={labelStyle}>Fecha del servicio *</label>
              <input
                type="date"
                className={inputStyle}
                min={hoyISO}
                value={form.fecha_del_servicio}
                onChange={(e) => setForm({ ...form, fecha_del_servicio: e.target.value })}
              />
            </div>

            {/* Horas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelStyle}>Hora inicio *</label>
                <input
                  type="time"
                  className={inputStyle}
                  value={form.hora_inicio}
                  onChange={(e) => setForm({ ...form, hora_inicio: e.target.value })}
                />
              </div>
              <div>
                <label className={labelStyle}>Hora fin *</label>
                <input
                  type="time"
                  className={inputStyle}
                  value={form.hora_fin}
                  onChange={(e) => setForm({ ...form, hora_fin: e.target.value })}
                />
              </div>
            </div>

            {/* Resumen horas */}
            {form.hora_inicio && form.hora_fin && (
              <div className="sm:col-span-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl text-sm text-blue-700">
                  <Clock size={14} />
                  Duración: <strong>{calcularHoras(form.hora_inicio, form.hora_fin)} horas</strong>
                </div>
              </div>
            )}

            {/* Observaciones */}
            <div className="sm:col-span-2">
              <label className={labelStyle}>Observaciones / tipo de acompañamiento</label>
              <textarea
                className={`${inputStyle} resize-none`}
                rows={3}
                placeholder="Describí el tipo de acompañamiento necesario, indicaciones especiales, etc."
                value={form.observaciones}
                onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleSubmit}
              disabled={enviando}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {enviando ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Enviar solicitud
            </button>
          </div>
        </div>
      )}

      {/* Historial */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-gray-400" />
          Historial de solicitudes
        </h2>

        {solicitudes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <CalendarClock size={36} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">No tenés solicitudes aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {solicitudes.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {s.paciente_nombre?.[0]}{s.paciente_apellido?.[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {s.paciente_nombre} {s.paciente_apellido}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {formatFecha(s.fecha_del_servicio)} · {formatHora(s.hora_inicio)} · {s.cantidad_horas_solicitadas}h
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColor(s.estado)}`}>
                    {s.estado || "Pendiente"}
                  </span>
                </div>
                {s.observaciones && (
                  <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-2">
                    {s.observaciones}
                  </p>
                )}
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => router.push(`/admin/dashboard/solicitudes/${s.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye size={14} />
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Vista Cuidador ───────────────────────────────────────────────────────────

function estadoColorCuidador(estado?: string) {
  if (!estado) return "bg-gray-100 text-gray-600";
  const lower = estado.toLowerCase();
  if (lower.includes("pendiente")) return "bg-amber-100 text-amber-700";
  if (lower.includes("asignad") || lower.includes("aprobad")) return "bg-blue-100 text-blue-700";
  if (lower.includes("en curso")) return "bg-purple-100 text-purple-700";
  if (lower.includes("finalizado") || lower.includes("completad")) return "bg-emerald-100 text-emerald-700";
  if (lower.includes("cancelad") || lower.includes("rechazad")) return "bg-red-100 text-red-600";
  return "bg-gray-100 text-gray-600";
}

function SolicitudesCuidadorView() {
  const router = useRouter();
  const [asignaciones, setAsignaciones] = useState<AsignacionCuidador[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarMisAsignaciones();
      setAsignaciones(data);
    } catch (err) {
      console.error("cargarDatos cuidador error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const formatFechaCuid = (fecha: string) => {
    try {
      return new Date(fecha).toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  const formatHoraCuid = (hora: string) => {
    try {
      return new Date(hora).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return hora;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase size={24} className="text-blue-500" />
          Mis Asignaciones
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Solicitudes de acompañamiento asignadas por el administrador
        </p>
      </div>

      {/* Lista */}
      {asignaciones.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Briefcase size={36} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 font-medium">No tenés asignaciones aún</p>
          <p className="text-gray-400 text-sm mt-1">El administrador te asignará solicitudes próximamente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {asignaciones.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                    {a.paciente_nombre?.[0]}{a.paciente_apellido?.[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {a.paciente_nombre} {a.paciente_apellido}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {formatFechaCuid(a.fecha_del_servicio)} · {formatHoraCuid(a.hora_inicio)} · {a.cantidad_horas_solicitadas}h
                    </p>
                    {a.tarea_descripcion && (
                      <p className="text-xs text-blue-500 mt-0.5 flex items-center gap-1">
                        <Stethoscope size={11} />
                        {a.tarea_descripcion}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${estadoColorCuidador(a.estado)}`}>
                    {a.estado || "—"}
                  </span>
                  {Number(a.id_pedido_estado) === 3 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                      Listo para iniciar
                    </span>
                  )}
                  {Number(a.id_pedido_estado) === 4 && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      En curso — podés finalizar
                    </span>
                  )}
                </div>
              </div>
              {a.observaciones && (
                <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-xl px-4 py-2">
                  {a.observaciones}
                </p>
              )}
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => router.push(`/admin/dashboard/solicitudes/${a.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Eye size={14} />
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Página principal (renderizado condicional por rol) ───────────────────────

export default function SolicitudesPage() {
  const [role, setRole] = useState<number | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    getMisDatos()
      .then((data) => {
        if (!data) { setRole(null); return; }
        let r = Number(data.role);
        if (isNaN(r)) {
          const name = String(data.nameRole || '');
          if (name === 'Admin') r = 1;
          else if (name === 'Cuidador') r = 2;
          else r = 3;
        }
        setRole(r);
      })
      .catch(() => setRole(null))
      .finally(() => setAuthLoading(false));
  }, []);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-blue-500" />
      </div>
    );
  }

  if (role === 1) return <SolicitudesAdminView />;
  if (role === 2) return <SolicitudesCuidadorView />;

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-blue-500" />
        </div>
      }
    >
      <SolicitudesFamiliarView />
    </Suspense>
  );
}
