"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  crearSolicitud,
  listarMisSolicitudes,
  type Solicitud,
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
} from "lucide-react";

export default function SolicitudesPage() {
  const searchParams = useSearchParams();
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
    const [pacs, sols] = await Promise.all([
      listarMisPacientes(),
      listarMisSolicitudes(),
    ]);
    setPacientes(pacs);
    setSolicitudes(sols);
    // auto-seleccionar si hay un solo paciente
    if (pacs.length === 1 && !form.id_paciente) {
      setForm((f) => ({ ...f, id_paciente: pacs[0].id }));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const calcularHoras = (inicio: string, fin: string): number => {
    if (!inicio || !fin) return 0;
    const [hi, mi] = inicio.split(":").map(Number);
    const [hf, mf] = fin.split(":").map(Number);
    const diff = (hf * 60 + mf - hi * 60 - mi) / 60;
    return Math.max(0, Math.round(diff * 100) / 100);
  };

  const hoyISO = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!form.id_paciente) {
      setMensaje({ tipo: "error", texto: "Seleccioná un paciente." });
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
      // hora viene como ISO timestamp con fecha 1970, extraer HH:mm
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
            Solicitá acompañamiento para tus pacientes
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
          <p className="text-amber-700 font-medium">Primero necesitás registrar un paciente</p>
          <p className="text-amber-500 text-sm mt-1">Andá a &quot;Mis Pacientes&quot; para agregar uno.</p>
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
              <label className={labelStyle}>Paciente *</label>
              <div className="relative">
                <select
                  className={`${inputStyle} appearance-none pr-10`}
                  value={form.id_paciente}
                  onChange={(e) => setForm({ ...form, id_paciente: parseInt(e.target.value) })}
                >
                  <option value={0}>Seleccioná un paciente</option>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
