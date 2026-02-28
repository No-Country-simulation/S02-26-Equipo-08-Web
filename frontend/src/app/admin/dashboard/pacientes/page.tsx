"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/src/context/UserContext";
import {
  listarMisPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPaciente,
  listarParentescos,
  type Paciente,
  type Parentesco,
} from "@/src/actions/pacientes";
import {
  listarDocumentosPaciente,
  obtenerTiposDocumento,
  subirDocumento,
  eliminarDocumento,
  obtenerUsuarioId,
  type TipoDocumento,
  type Documento,
} from "@/src/actions/documentos";
import {
  UserPlus,
  Search,
  Heart,
  Edit3,
  X,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Image,
  CalendarClock,
} from "lucide-react";

export default function PacientesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [parentescos, setParentescos] = useState<Parentesco[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const [modoDocCreacion, setModoDocCreacion] = useState(false);
  // documentacion
  const [expandedDoc, setExpandedDoc] = useState<number | null>(null);
  const [docsMap, setDocsMap] = useState<Record<number, Documento[]>>({});
  const [tiposDocPaciente, setTiposDocPaciente] = useState<TipoDocumento[]>([]);
  const [uploadingDoc, setUploadingDoc] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    direccion: "",
    telefono: "",
    edad: "",
    diagnostico: "",
    obra_social: "",
    nro_afiliado: "",
    id_parentesco: 1,
  });

  const cargarPacientes = useCallback(async () => {
    setLoading(true);
    const data = await listarMisPacientes();
    setPacientes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    cargarPacientes();
    listarParentescos().then(setParentescos);
    obtenerTiposDocumento("paciente").then(setTiposDocPaciente);
  }, [cargarPacientes]);

  const resetForm = () => {
    setForm({
      nombre: "",
      apellido: "",
      identificacion: "",
      direccion: "",
      telefono: "",
      edad: "",
      diagnostico: "",
      obra_social: "",
      nro_afiliado: "",
      id_parentesco: 1,
    });
    setEditandoId(null);
    setShowForm(false);
    setModoDocCreacion(false);
  };

  const iniciarEdicion = (p: Paciente) => {
    setForm({
      nombre: p.nombre,
      apellido: p.apellido,
      identificacion: p.identificacion,
      direccion: p.direccion || "",
      telefono: p.telefono || "",
      edad: p.edad?.toString() || "",
      diagnostico: p.diagnostico || "",
      obra_social: p.obra_social || "",
      nro_afiliado: p.nro_afiliado || "",
      id_parentesco: p.id_parentesco || 1,
    });
    setEditandoId(p.id);
    setShowForm(true);
    // Cargar docs del paciente para mostrar en el formulario
    if (!docsMap[p.id]) {
      listarDocumentosPaciente(p.id).then((docs) => {
        setDocsMap((prev) => ({ ...prev, [p.id]: docs }));
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardar = async () => {
    if (!form.nombre || !form.apellido || !form.identificacion) {
      setMensaje({ tipo: "error", texto: "Nombre, apellido e identificación son obligatorios." });
      return;
    }
    setEnviando(true);
    setMensaje(null);

    const datos = {
      nombre: form.nombre,
      apellido: form.apellido,
      identificacion: form.identificacion,
      direccion: form.direccion || undefined,
      telefono: form.telefono || undefined,
      edad: form.edad ? parseInt(form.edad) : undefined,
      diagnostico: form.diagnostico || undefined,
      obra_social: form.obra_social || undefined,
      nro_afiliado: form.nro_afiliado || undefined,
      id_parentesco: form.id_parentesco,
    };

    if (editandoId) {
      const result = await actualizarPaciente(editandoId, datos);
      if (result.success) {
        setMensaje({ tipo: "ok", texto: result.message });
        resetForm();
        cargarPacientes();
      } else {
        setMensaje({ tipo: "error", texto: result.message });
      }
    } else {
      const result = await crearPaciente(datos);
      if (result.success) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nuevoPacienteId = (result.data as any)?.paciente?.id as number | undefined;
        cargarPacientes();
        if (nuevoPacienteId) {
          setEditandoId(nuevoPacienteId);
          setModoDocCreacion(true);
          listarDocumentosPaciente(nuevoPacienteId).then((docs) => {
            setDocsMap((prev) => ({ ...prev, [nuevoPacienteId]: docs }));
          });
          setMensaje({ tipo: "ok", texto: "Paciente creado. Podés subir la documentación ahora o más tarde." });
        } else {
          resetForm();
          setMensaje({ tipo: "ok", texto: result.message });
        }
      } else {
        setMensaje({ tipo: "error", texto: result.message });
      }
    }
    setEnviando(false);
  };

  const toggleDocs = async (pacienteId: number) => {
    if (expandedDoc === pacienteId) {
      setExpandedDoc(null);
      return;
    }
    setExpandedDoc(pacienteId);
    if (!docsMap[pacienteId]) {
      const docs = await listarDocumentosPaciente(pacienteId);
      setDocsMap((prev) => ({ ...prev, [pacienteId]: docs }));
    }
  };

  const handleUploadDoc = async (pacienteId: number, tipoId: number, file: File) => {
    const key = `${pacienteId}-${tipoId}`;
    setUploadingDoc((p) => ({ ...p, [key]: true }));
    const userId = await obtenerUsuarioId();
    if (!userId) return;

    const formData = new FormData();
    formData.append("archivo", file);
    formData.append("id_tipo_documento", tipoId.toString());
    formData.append("id_paciente", pacienteId.toString());
    formData.append("subido_por", userId.toString());

    const result = await subirDocumento(formData);
    if (result.success) {
      const docs = await listarDocumentosPaciente(pacienteId);
      setDocsMap((prev) => ({ ...prev, [pacienteId]: docs }));
    }
    setUploadingDoc((p) => ({ ...p, [key]: false }));
  };

  const handleDeleteDoc = async (pacienteId: number, docId: number) => {
    await eliminarDocumento(docId);
    const docs = await listarDocumentosPaciente(pacienteId);
    setDocsMap((prev) => ({ ...prev, [pacienteId]: docs }));
  };

  const handleEliminar = async (pacienteId: number) => {
    if (!confirm("¿Estás seguro de eliminar este paciente?")) return;
    const result = await eliminarPaciente(pacienteId);
    if (result.success) {
      setMensaje({ tipo: "ok", texto: result.message });
      cargarPacientes();
    } else {
      setMensaje({ tipo: "error", texto: result.message });
    }
  };

  const pacientesFiltrados = pacientes.filter((p) => {
    const q = busqueda.toLowerCase();
    return (
      p.nombre.toLowerCase().includes(q) ||
      p.apellido.toLowerCase().includes(q) ||
      p.identificacion.includes(q)
    );
  });

  const inputStyle =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all";
  const labelStyle = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Familiares</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pacientes.length === 0
              ? "Agregá tu primer paciente"
              : `${pacientes.length} paciente(s) registrado(s)`}
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Agregar familiar
          </button>
        )}
      </div>

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
            <h2 className="text-lg font-semibold text-gray-900">
              {modoDocCreacion ? "Documentación del paciente" : editandoId ? "Editar paciente" : "Nuevo paciente"}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <X size={20} />
            </button>
          </div>

          {/* Modo documentación post-creación */}
          {modoDocCreacion && editandoId && (
            <>
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-700 text-sm">
                ✓ Paciente creado correctamente. Subí la documentación ahora o hacelo más tarde desde la tarjeta del paciente.
              </div>
              <div className="space-y-3">
                {tiposDocPaciente.map((tipo) => {
                  const docExistente = docsMap[editandoId]?.find((d) => d.id_tipo_documento === tipo.id);
                  const key = `${editandoId}-${tipo.id}`;
                  const isUploading = uploadingDoc[key];
                  return (
                    <div
                      key={tipo.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {docExistente ? (
                          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                        ) : (
                          <AlertCircle size={16} className="text-gray-300 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {tipo.descripcion}
                            {tipo.obligatorio && <span className="text-red-400 ml-1">*</span>}
                          </p>
                          {docExistente && (
                            <p className="text-xs text-gray-400 truncate">{docExistente.nombre_archivo}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {docExistente ? (
                          <>
                            <a
                              href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${docExistente.ruta_archivo}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                              title="Ver"
                            >
                              <Image size={14} />
                            </a>
                            <button
                              onClick={() => handleDeleteDoc(editandoId, docExistente.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        ) : (
                          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 cursor-pointer transition-all">
                            {isUploading ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Upload size={12} />
                            )}
                            Subir
                            <input
                              type="file"
                              className="hidden"
                              accept=".pdf,.jpg,.jpeg,.png,.webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadDoc(editandoId, tipo.id, file);
                                e.target.value = "";
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end pt-2">
                <button
                  onClick={resetForm}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={14} />
                  Finalizar
                </button>
              </div>
            </>
          )}

          {/* Campos del formulario (creación / edición normal) */}
          {!modoDocCreacion && (<><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Nombre *</label>
              <input
                className={inputStyle}
                placeholder="Nombre del paciente"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div>
              <label className={labelStyle}>Apellido *</label>
              <input
                className={inputStyle}
                placeholder="Apellido"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              />
            </div>
            <div>
              <label className={labelStyle}>DNI / Identificación *</label>
              <input
                className={inputStyle}
                placeholder="Número de documento"
                value={form.identificacion}
                onChange={(e) => setForm({ ...form, identificacion: e.target.value })}
              />
            </div>
            <div>
              <label className={labelStyle}>Teléfono</label>
              <input
                className={inputStyle}
                placeholder="Teléfono de contacto"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
            </div>
            <div>
              <label className={labelStyle}>Dirección</label>
              <input
                className={inputStyle}
                placeholder="Dirección"
                value={form.direccion}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              />
            </div>
            <div>
              <label className={labelStyle}>Edad</label>
              <input
                className={inputStyle}
                type="number"
                placeholder="Edad"
                value={form.edad}
                onChange={(e) => setForm({ ...form, edad: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelStyle}>Diagnóstico</label>
              <textarea
                className={`${inputStyle} resize-none`}
                rows={2}
                placeholder="Descripción del diagnóstico o condición"
                value={form.diagnostico}
                onChange={(e) => setForm({ ...form, diagnostico: e.target.value })}
              />
            </div>
            <div>
              <label className={labelStyle}>Obra Social</label>
              <input
                className={inputStyle}
                placeholder="Nombre de la obra social"
                value={form.obra_social}
                onChange={(e) => setForm({ ...form, obra_social: e.target.value })}
              />
            </div>
            <div>
              <label className={labelStyle}>N° Afiliado</label>
              <input
                className={inputStyle}
                placeholder="Número de afiliado"
                value={form.nro_afiliado}
                onChange={(e) => setForm({ ...form, nro_afiliado: e.target.value })}
              />
            </div>
            {parentescos.length > 0 && (
              <div>
                <label className={labelStyle}>Parentesco</label>
                <select
                  className={inputStyle}
                  value={form.id_parentesco}
                  onChange={(e) => setForm({ ...form, id_parentesco: parseInt(e.target.value) })}
                >
                  {parentescos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.descripcion}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm font-medium hover:text-gray-700 hover:border-gray-300 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              disabled={enviando}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {enviando && <Loader2 size={14} className="animate-spin" />}
              {editandoId ? "Guardar cambios" : "Crear fammiliar"}
            </button>
          </div>

          {/* Documentación inline durante edición */}
          {editandoId && !modoDocCreacion && (
            <div className="border-t border-gray-100 pt-5 mt-2 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                Documentación del paciente
                {docsMap[editandoId] && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                    {docsMap[editandoId].length} subido(s)
                  </span>
                )}
              </h3>
              {tiposDocPaciente.map((tipo) => {
                const docExistente = docsMap[editandoId]?.find(
                  (d) => d.id_tipo_documento === tipo.id
                );
                const key = `${editandoId}-${tipo.id}`;
                const isUploading = uploadingDoc[key];

                return (
                  <div
                    key={tipo.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {docExistente ? (
                        <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      ) : (
                        <AlertCircle size={16} className="text-gray-300 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {tipo.descripcion}
                          {tipo.obligatorio && <span className="text-red-400 ml-1">*</span>}
                        </p>
                        {docExistente && (
                          <p className="text-xs text-gray-400 truncate">
                            {docExistente.nombre_archivo}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {docExistente ? (
                        <>
                          <a
                            href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${docExistente.ruta_archivo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                            title="Ver"
                          >
                            <Image size={14} />
                          </a>
                          <button
                            onClick={() => handleDeleteDoc(editandoId, docExistente.id)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      ) : (
                        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 cursor-pointer transition-all">
                          {isUploading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Upload size={12} />
                          )}
                          Subir
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadDoc(editandoId, tipo.id, file);
                              e.target.value = "";
                            }}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          </>)}
        </div>
      )}

      {/* Buscador — oculto durante edición */}
      {pacientes.length > 0 && !editandoId && (
        <div className="relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o DNI..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      )}

      {/* Lista — oculta durante edición */}
      {editandoId ? null : loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-blue-500" />
        </div>
      ) : pacientesFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Heart size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400 font-medium">
            {busqueda ? "No se encontraron resultados" : "No tenés pacientes registrados aún"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pacientesFiltrados.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Card header */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {p.nombre[0]}
                      {p.apellido[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {p.nombre} {p.apellido}
                      </h3>
                      <p className="text-xs text-gray-400">
                        DNI: {p.identificacion}
                        {p.parentesco && ` · ${p.parentesco}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/dashboard/solicitudes?pacienteId=${p.id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-medium hover:bg-emerald-100 transition-all cursor-pointer"
                      title="Solicitar acompañamiento"
                    >
                      <CalendarClock size={14} />
                      Solicitar acompañamiento
                    </button>
                    <button
                      onClick={() => iniciarEdicion(p)}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer"
                      title="Editar"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Details grid */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                  {p.edad && (
                    <div>
                      <span className="text-gray-400 text-xs">Edad</span>
                      <p className="text-gray-700 font-medium">{p.edad} años</p>
                    </div>
                  )}
                  {p.diagnostico && (
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-gray-400 text-xs">Diagnóstico</span>
                      <p className="text-gray-700 font-medium truncate">{p.diagnostico}</p>
                    </div>
                  )}
                  {p.obra_social && (
                    <div>
                      <span className="text-gray-400 text-xs">Obra Social</span>
                      <p className="text-gray-700 font-medium">{p.obra_social}</p>
                    </div>
                  )}
                  {p.telefono && (
                    <div>
                      <span className="text-gray-400 text-xs">Teléfono</span>
                      <p className="text-gray-700 font-medium">{p.telefono}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document section toggle */}
              <button
                onClick={() => toggleDocs(p.id)}
                className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText size={14} />
                  Documentación
                  {docsMap[p.id] && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                      {docsMap[p.id].length}
                    </span>
                  )}
                </span>
                {expandedDoc === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {/* Document section content */}
              {expandedDoc === p.id && (
                <div className="px-5 py-4 bg-gray-50/50 border-t border-gray-100 space-y-3">
                  {tiposDocPaciente.map((tipo) => {
                    const docExistente = docsMap[p.id]?.find(
                      (d) => d.id_tipo_documento === tipo.id
                    );
                    const key = `${p.id}-${tipo.id}`;
                    const isUploading = uploadingDoc[key];

                    return (
                      <div
                        key={tipo.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200 bg-white"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {docExistente ? (
                            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                          ) : (
                            <AlertCircle size={16} className="text-gray-300 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {tipo.descripcion}
                            </p>
                            {docExistente && (
                              <p className="text-xs text-gray-400 truncate">
                                {docExistente.nombre_archivo}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {docExistente ? (
                            <>
                              <a
                                href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}/${docExistente.ruta_archivo}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-all"
                                title="Ver"
                              >
                                <Image size={14} />
                              </a>
                              <button
                                onClick={() => handleDeleteDoc(p.id, docExistente.id)}
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          ) : (
                            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 cursor-pointer transition-all">
                              {isUploading ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Upload size={12} />
                              )}
                              Subir
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadDoc(p.id, tipo.id, file);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}