"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  MapPin,
  Loader2,
  CheckCircle2,
  Heart,
  Check,
  UserRound,
  FileCheck,
  Upload,
  FileText,
  Image,
} from "lucide-react";
import { registroFamiliarSchema, type RegistroFamiliarForm } from "@/src/types/registro";
import { registrarFamiliarAction } from "@/src/actions/registro";
import { obtenerTiposDocumento, type TipoDocumento } from "@/src/actions/documentos";

const PASOS = [
  { titulo: "Cuenta", descripcion: "Email y contraseña", icon: Mail },
  { titulo: "Datos Personales", descripcion: "Tu información básica", icon: User },
  { titulo: "Documentación", descripcion: "Opcional — podés subirla después", icon: FileCheck },
  { titulo: "Confirmación", descripcion: "Revisá y confirmá", icon: CheckCircle2 },
];

export default function RegistroFamiliarPage() {
  const [paso, setPaso] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<RegistroFamiliarForm>({
    // z.coerce.number() infiere el input como unknown en Zod v3, el cast resuelve el conflicto de tipos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(registroFamiliarSchema) as any,
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      confirmarPassword: "",
      nombre: "",
      apellido: "",
      identificacion: "",
      telefono: "",
      direccion: "",
      edad: undefined,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tiposDoc, setTiposDoc] = useState<TipoDocumento[]>([]);
  const [archivosSeleccionados, setArchivosSeleccionados] = useState<Record<number, File>>({});
  const [docUploadStatus, setDocUploadStatus] = useState<Record<number, "idle" | "uploading" | "success" | "error">>({});

  const camposPorPaso: (keyof RegistroFamiliarForm)[][] = [
    ["email", "password", "confirmarPassword"],
    ["nombre", "apellido", "identificacion", "telefono", "direccion", "edad"],
    [], // documentacion, no valida campos
    [], // confirmacion, no valida campos nuevos
  ];

  const avanzar = async () => {
    const campos = camposPorPaso[paso];
    // paso de documentación (2) es opcional
    if (paso === 2) {
      setPaso(paso + 1);
      return;
    }
    // al salir del paso 1, cargar tipos de doc para el siguiente paso
    if (paso === 1) {
      obtenerTiposDocumento("familiar").then(setTiposDoc);
    }
    const valido = await trigger(campos);
    if (valido) {
      setServerError(null);
      setPaso(paso + 1);
    }
  };

  const retroceder = () => {
    setServerError(null);
    setPaso(paso - 1);
  };

  // submit manual: solo se ejecuta al hacer click en "Confirmar Registro"
  const confirmarRegistro = async () => {
    setServerError(null);

    // validar todos los campos antes de enviar
    const valido = await trigger();
    if (!valido) {
      setServerError("Hay errores en el formulario. Revisá los pasos anteriores.");
      return;
    }

    setEnviando(true);

    try {
      const data = getValues();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmarPassword, ...datosRegistro } = data;

      const result = await registrarFamiliarAction(datosRegistro);

      if (result.success) {
        setRegistroExitoso(true);
      } else {
        setServerError(result.message);
      }
    } catch {
      setServerError("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  // pantalla de exito
  if (registroExitoso) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center px-6"
        style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <Check className="text-white" size={32} />
          </div>
          <h1
            className="text-2xl text-gray-900"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontWeight: 600,
            }}
          >
            ¡Registro exitoso!
          </h1>
          <p className="text-gray-500" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
            Tu cuenta fue creada correctamente. Ya podés iniciar sesión con tu email y contraseña.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10"
              style={{ fontSize: "0.88rem", fontWeight: 500 }}
            >
              Ir al Login
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
              style={{ fontSize: "0.88rem", fontWeight: 500 }}
            >
              Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const valores = getValues();

  const inputBase = "w-full py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white";
  const inputError = "border-red-300 focus:border-red-400 focus:ring-red-50";
  const labelStyle = "text-sm font-medium text-gray-700 block mb-1.5";

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-white"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {/* Panel izquierdo - Branding (solo desktop) */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] bg-[#011627] relative overflow-hidden flex-col justify-between p-10 sticky top-0 h-screen overflow-y-auto">
        <div className="absolute top-[-20%] right-[-30%] w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-15" />
        <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-sky-400 rounded-full blur-[140px] opacity-10" />

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span
              className="text-white tracking-tight"
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "1.3rem",
                fontWeight: 600,
              }}
            >
              PYMECare
            </span>
          </Link>

          {/* Título motivacional */}
          <h2
            className="text-white mb-3"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "1.85rem",
              fontWeight: 600,
              lineHeight: 1.3,
            }}
          >
            El cuidado que tu familia merece
          </h2>
          <p className="text-gray-400 mb-12" style={{ fontSize: "0.88rem", lineHeight: 1.7 }}>
            Encontrá acompañantes terapéuticos verificados para tus seres queridos. Tranquilidad y confianza garantizadas.
          </p>

          {/* Stepper vertical */}
          <div className="space-y-5">
            {PASOS.map((p, i) => {
              const Icon = p.icon;
              const isCompleted = i < paso;
              const isCurrent = i === paso;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-emerald-500/20"
                        : isCurrent
                          ? "bg-gradient-to-br from-blue-500 to-sky-500 shadow-md shadow-blue-500/20"
                          : "bg-white/5"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Icon className={`w-4 h-4 ${isCurrent ? "text-white" : "text-gray-500"}`} />
                    )}
                  </div>
                  <div>
                    <span
                      className={`block text-sm font-medium ${
                        isCompleted ? "text-emerald-400" : isCurrent ? "text-white" : "text-gray-500"
                      }`}
                    >
                      {p.titulo}
                    </span>
                    <span className="block text-xs text-gray-500">{p.descripcion}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer del panel */}
        <div className="relative z-10 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-xs">
            ¿Sos cuidador o acompañante terapéutico?{" "}
            <Link href="/registro/cuidador" className="text-blue-400 hover:text-blue-300 transition-colors">
              Registrate acá →
            </Link>
          </p>
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header mobile */}
        <header className="lg:hidden w-full border-b border-gray-100 bg-white">
          <div className="px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-white" fill="white" />
              </div>
              <span
                className="text-gray-900 tracking-tight"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                }}
              >
                PYMECare
              </span>
            </Link>
            <Link
              href="/login"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              style={{ fontSize: "0.82rem", fontWeight: 500 }}
            >
              ¿Ya tenés cuenta?
            </Link>
          </div>
        </header>

        {/* Contenido del formulario */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
          <div className="w-full max-w-lg">
            {/* Titulo + indicador de paso */}
            <div className="mb-8">
              <p className="text-blue-500 font-medium text-sm mb-2">
                Paso {paso + 1} de {PASOS.length}
              </p>
              <h1
                className="text-gray-900 mb-1"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "1.65rem",
                  fontWeight: 600,
                }}
              >
                {PASOS[paso].titulo}
              </h1>
              <p className="text-gray-400" style={{ fontSize: "0.88rem" }}>
                {PASOS[paso].descripcion}
              </p>
            </div>

            {/* Progress bar mobile */}
            <div className="flex gap-1.5 mb-8">
              {PASOS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                    i < paso ? "bg-emerald-400" : i === paso ? "bg-blue-500" : "bg-gray-100"
                  }`}
                />
              ))}
            </div>

            {/* Card del formulario */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={paso}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* PASO 0: Cuenta */}
                  {paso === 0 && (
                    <div className="space-y-5">
                      <div>
                        <label className={labelStyle}>Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="tu@email.com"
                            className={`${inputBase} pl-10 pr-4 ${errors.email ? inputError : ""}`}
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className={labelStyle}>Contraseña</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                          <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Mínimo 6 caracteres"
                            className={`${inputBase} pl-10 pr-10 ${errors.password ? inputError : ""}`}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
                      </div>

                      <div>
                        <label className={labelStyle}>Confirmar contraseña</label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                          <input
                            {...register("confirmarPassword")}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Repetí tu contraseña"
                            className={`${inputBase} pl-10 pr-10 ${errors.confirmarPassword ? inputError : ""}`}
                          />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                            {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                        </div>
                        {errors.confirmarPassword && <p className="text-red-500 text-xs mt-1.5">{errors.confirmarPassword.message}</p>}
                      </div>
                    </div>
                  )}

                  {/* PASO 1: Datos personales */}
                  {paso === 1 && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelStyle}>Nombre</label>
                          <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                            <input
                              {...register("nombre")}
                              placeholder="María"
                              className={`${inputBase} pl-10 pr-4 ${errors.nombre ? inputError : ""}`}
                            />
                          </div>
                          {errors.nombre && <p className="text-red-500 text-xs mt-1.5">{errors.nombre.message}</p>}
                        </div>
                        <div>
                          <label className={labelStyle}>Apellido</label>
                          <input
                            {...register("apellido")}
                            placeholder="González"
                            className={`${inputBase} px-4 ${errors.apellido ? inputError : ""}`}
                          />
                          {errors.apellido && <p className="text-red-500 text-xs mt-1.5">{errors.apellido.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelStyle}>DNI</label>
                          <input
                            {...register("identificacion")}
                            placeholder="12345678"
                            className={`${inputBase} px-4 ${errors.identificacion ? inputError : ""}`}
                          />
                          {errors.identificacion && <p className="text-red-500 text-xs mt-1.5">{errors.identificacion.message}</p>}
                        </div>
                        <div>
                          <label className={labelStyle}>Edad</label>
                          <input
                            {...register("edad")}
                            type="number"
                            placeholder="45"
                            className={`${inputBase} px-4 ${errors.edad ? inputError : ""}`}
                          />
                          {errors.edad && <p className="text-red-500 text-xs mt-1.5">{errors.edad.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className={labelStyle}>Teléfono</label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                          <input
                            {...register("telefono")}
                            placeholder="+54 11 1234-5678"
                            className={`${inputBase} pl-10 pr-4 ${errors.telefono ? inputError : ""}`}
                          />
                        </div>
                        {errors.telefono && <p className="text-red-500 text-xs mt-1.5">{errors.telefono.message}</p>}
                      </div>

                      <div>
                        <label className={labelStyle}>Dirección</label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                          <input
                            {...register("direccion")}
                            placeholder="Av. Corrientes 1234, CABA"
                            className={`${inputBase} pl-10 pr-4 ${errors.direccion ? inputError : ""}`}
                          />
                        </div>
                        {errors.direccion && <p className="text-red-500 text-xs mt-1.5">{errors.direccion.message}</p>}
                      </div>
                    </div>
                  )}

                  {/* PASO 2: Documentación (opcional) */}
                  {paso === 2 && (
                    <div className="space-y-4">
                      <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 text-blue-700" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                        Seleccioná los archivos que quieras subir ahora. Si preferís, podés hacerlo después desde <span className="font-semibold">&quot;Mi Documentación&quot;</span> en tu panel.
                      </div>

                      {tiposDoc.map((tipo) => {
                        const archivo = archivosSeleccionados[tipo.id];
                        const uploadStatus = docUploadStatus[tipo.id] || "idle";
                        return (
                          <div key={tipo.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 border-b border-gray-100">
                              <span className="font-medium text-sm text-gray-800 truncate">{tipo.descripcion}</span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                tipo.obligatorio ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                              }`}>
                                {tipo.obligatorio ? "Obligatorio" : "Opcional"}
                              </span>
                            </div>
                            <div className="p-4">
                              {archivo ? (
                                <div className={`flex items-center gap-3 p-3 rounded-lg border ${
                                  uploadStatus === "success" ? "bg-green-50 border-green-100" : "bg-blue-50 border-blue-100"
                                }`}>
                                  {uploadStatus === "success" ? (
                                    <CheckCircle2 size={18} className="text-green-600 shrink-0" />
                                  ) : archivo.name.endsWith(".pdf") ? (
                                    <FileText size={18} className="text-red-500 shrink-0" />
                                  ) : (
                                    <Image size={18} className="text-blue-500 shrink-0" />
                                  )}
                                  <span className="text-sm text-gray-700 truncate flex-1">{archivo.name}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nuevos = { ...archivosSeleccionados };
                                      delete nuevos[tipo.id];
                                      setArchivosSeleccionados(nuevos);
                                      const nuevoStatus = { ...docUploadStatus };
                                      delete nuevoStatus[tipo.id];
                                      setDocUploadStatus(nuevoStatus);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                                  >
                                    Quitar
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all">
                                  <Upload size={20} className="text-gray-400" />
                                  <span className="text-sm text-gray-500">
                                    <span className="text-blue-600 font-medium">Seleccioná</span> un archivo
                                  </span>
                                  <span className="text-[11px] text-gray-400">PDF, JPG, PNG o WebP · Máx 5MB</span>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        if (file.size > 5 * 1024 * 1024) {
                                          alert("El archivo supera los 5MB.");
                                          return;
                                        }
                                        setArchivosSeleccionados({ ...archivosSeleccionados, [tipo.id]: file });
                                      }
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

                  {/* PASO 3: Confirmación */}
                  {paso === 3 && (
                    <div className="space-y-5">
                      <div className="bg-gray-50 rounded-xl p-5 space-y-3" style={{ fontSize: "0.85rem" }}>
                        <h3 className="font-semibold text-gray-900 text-sm">Resumen de tu registro</h3>
                        <div className="grid grid-cols-[auto_1fr] gap-y-2.5 gap-x-4">
                          <span className="text-gray-400">Email</span>
                          <span className="font-medium text-gray-700">{valores.email}</span>
                          <span className="text-gray-400">Nombre</span>
                          <span className="font-medium text-gray-700">{valores.nombre} {valores.apellido}</span>
                          <span className="text-gray-400">DNI</span>
                          <span className="font-medium text-gray-700">{valores.identificacion}</span>
                          <span className="text-gray-400">Teléfono</span>
                          <span className="font-medium text-gray-700">{valores.telefono}</span>
                          <span className="text-gray-400">Dirección</span>
                          <span className="font-medium text-gray-700">{valores.direccion}</span>
                          <span className="text-gray-400">Edad</span>
                          <span className="font-medium text-gray-700">{valores.edad} años</span>
                          {Object.keys(archivosSeleccionados).length > 0 && (
                            <>
                              <span className="text-gray-400">Documentos</span>
                              <span className="font-medium text-gray-700">
                                {Object.keys(archivosSeleccionados).length} archivo(s) seleccionado(s)
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-4 text-emerald-700" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                        Una vez registrado, ya podés iniciar sesión con tu email y contraseña.
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error del servidor */}
              {serverError && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 mt-5" style={{ fontSize: "0.82rem" }}>
                  {serverError}
                </div>
              )}

              {/* Botones de navegacion */}
              <div className="flex justify-between gap-4 pt-6 mt-2 border-t border-gray-50">
                {paso > 0 ? (
                  <button
                    type="button"
                    onClick={retroceder}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all cursor-pointer"
                    style={{ fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    <ArrowLeft size={15} />
                    Anterior
                  </button>
                ) : (
                  <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all"
                    style={{ fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    <ArrowLeft size={15} />
                    Volver
                  </Link>
                )}

                {paso < PASOS.length - 1 ? (
                  <button
                    type="button"
                    onClick={avanzar}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:from-blue-600 hover:to-sky-600 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                    style={{ fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    Siguiente
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={enviando}
                    onClick={confirmarRegistro}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 disabled:opacity-50 cursor-pointer"
                    style={{ fontSize: "0.85rem", fontWeight: 500 }}
                  >
                    {enviando ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Registrando...
                      </>
                    ) : (
                      <>
                        Confirmar Registro
                        <CheckCircle2 size={15} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Link cruzado (mobile) */}
            <p className="lg:hidden text-center text-gray-400 mt-6" style={{ fontSize: "0.8rem" }}>
              ¿Sos cuidador o acompañante terapéutico?{" "}
              <Link href="/registro/cuidador" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
                Registrate acá →
              </Link>
            </p>

            {/* Login link */}
            <p className="hidden lg:block text-center text-gray-400 mt-6" style={{ fontSize: "0.8rem" }}>
              ¿Ya tenés cuenta?{" "}
              <Link href="/login" className="text-blue-500 hover:text-blue-600 transition-colors font-medium">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
