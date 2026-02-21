"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
  CreditCard,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { registroCuidadorSchema, type RegistroCuidadorForm } from "@/src/types/registro";
import { registrarCuidadorAction } from "@/src/actions/registro";

const PASOS = [
  { titulo: "Cuenta", descripcion: "Email y contraseña" },
  { titulo: "Datos Personales", descripcion: "Tu información básica" },
  { titulo: "Datos Bancarios", descripcion: "Opcional — podés completarlo después" },
  { titulo: "Confirmación", descripcion: "Revisá y confirmá" },
];

export default function RegistroCuidadorPage() {
  const [paso, setPaso] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const {
    register,
    trigger,
    getValues,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<RegistroCuidadorForm>({
    resolver: zodResolver(registroCuidadorSchema) as any,
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
      cbu: "",
      cvu: "",
      alias: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // campos a validar en cada paso
  const camposPorPaso: (keyof RegistroCuidadorForm)[][] = [
    ["email", "password", "confirmarPassword"],
    ["nombre", "apellido", "identificacion", "telefono", "direccion", "edad"],
    ["cbu", "cvu", "alias"], // opcionales
    [], // confirmacion, no valida campos nuevos
  ];

  const avanzar = async () => {
    const campos = camposPorPaso[paso];
    // el paso 2 (bancarios) es opcional, no validamos
    if (paso === 2) {
      setPaso(paso + 1);
      return;
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

      const result = await registrarCuidadorAction(datosRegistro);

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
      <div className="min-h-screen bg-brand-secondary flex items-center justify-center px-6">
        <div className="max-w-md text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-emerald-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-brand-primary">
            ¡Registro enviado!
          </h1>
          <p className="text-slate-500">
            Tu cuenta fue creada y está{" "}
            <span className="font-bold text-amber-600">pendiente de aprobación</span>{" "}
            por un administrador. Te notificaremos cuando esté habilitada.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            Ir al Login
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const valores = getValues();

  return (
    <div className="min-h-screen bg-brand-secondary flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-primary flex items-center justify-center rounded-xl">
              <ShieldCheck className="text-brand-accent" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-brand-primary">
              Masi<span className="text-brand-accent">Care</span>
            </span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-500 hover:text-brand-accent transition-colors"
          >
            ¿Ya tenés cuenta?
          </Link>
        </div>
      </header>

      {/* Contenido */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg space-y-8">
          {/* Titulo */}
          <div>
            <h1 className="text-3xl font-bold text-brand-primary">
              Registro de Cuidador
            </h1>
            <p className="text-slate-500 mt-1">
              {PASOS[paso].descripcion}
            </p>
          </div>

          {/* Indicador de pasos */}
          <div className="flex gap-2">
            {PASOS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= paso ? "bg-brand-accent" : "bg-slate-200"
                }`}
              />
            ))}
          </div>

          {/* Usamos div en vez de form para evitar submit automatico del navegador */}
          <div className="space-y-6">
            {/* PASO 0: Cuenta */}
            {paso === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="tu@email.com"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.email ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">Contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.password ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">Confirmar contraseña</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      {...register("confirmarPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repetí tu contraseña"
                      className={`w-full pl-10 pr-10 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.confirmarPassword ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmarPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmarPassword.message}</p>}
                </div>
              </div>
            )}

            {/* PASO 1: Datos personales */}
            {paso === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-brand-primary block mb-1">Nombre</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        {...register("nombre")}
                        placeholder="Juan"
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                          errors.nombre ? "border-red-400" : "border-slate-200 focus:border-brand-accent"
                        }`}
                      />
                    </div>
                    {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-primary block mb-1">Apellido</label>
                    <input
                      {...register("apellido")}
                      placeholder="Pérez"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.apellido ? "border-red-400" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                    {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-brand-primary block mb-1">DNI</label>
                    <input
                      {...register("identificacion")}
                      placeholder="12345678"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.identificacion ? "border-red-400" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                    {errors.identificacion && <p className="text-red-500 text-xs mt-1">{errors.identificacion.message}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-brand-primary block mb-1">Edad</label>
                    <input
                      {...register("edad")}
                      type="number"
                      placeholder="30"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.edad ? "border-red-400" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                    {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">Teléfono</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      {...register("telefono")}
                      placeholder="+54 11 1234-5678"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.telefono ? "border-red-400" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                  </div>
                  {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">Dirección</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      {...register("direccion")}
                      placeholder="Av. Corrientes 1234, CABA"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                        errors.direccion ? "border-red-400" : "border-slate-200 focus:border-brand-accent"
                      }`}
                    />
                  </div>
                  {errors.direccion && <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>}
                </div>
              </div>
            )}

            {/* PASO 2: Datos bancarios (opcional) */}
            {paso === 2 && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                  Estos datos son opcionales. Podés completarlos más adelante desde tu perfil.
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">CBU</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      {...register("cbu")}
                      placeholder="0000000000000000000000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">CVU</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      {...register("cvu")}
                      placeholder="0000000000000000000000"
                      className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-accent transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-brand-primary block mb-1">Alias</label>
                  <input
                    {...register("alias")}
                    placeholder="mi.alias.mp"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-accent transition-colors"
                  />
                </div>
              </div>
            )}

            {/* PASO 3: Confirmación */}
            {paso === 3 && (
              <div className="space-y-4">
                <div className="bg-white border-2 border-slate-200 rounded-xl p-6 space-y-3 text-sm">
                  <h3 className="font-bold text-brand-primary text-base">Resumen de tu registro</h3>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <span className="text-slate-400">Email:</span>
                    <span className="font-medium text-brand-primary">{valores.email}</span>
                    <span className="text-slate-400">Nombre:</span>
                    <span className="font-medium text-brand-primary">{valores.nombre} {valores.apellido}</span>
                    <span className="text-slate-400">DNI:</span>
                    <span className="font-medium text-brand-primary">{valores.identificacion}</span>
                    <span className="text-slate-400">Teléfono:</span>
                    <span className="font-medium text-brand-primary">{valores.telefono}</span>
                    <span className="text-slate-400">Dirección:</span>
                    <span className="font-medium text-brand-primary">{valores.direccion}</span>
                    <span className="text-slate-400">Edad:</span>
                    <span className="font-medium text-brand-primary">{valores.edad} años</span>
                    {valores.alias && (
                      <>
                        <span className="text-slate-400">Alias bancario:</span>
                        <span className="font-medium text-brand-primary">{valores.alias}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                  Tu cuenta quedará en estado <span className="font-bold">PENDIENTE</span> hasta que un administrador la valide.
                  No podrás iniciar sesión hasta entonces.
                </div>
              </div>
            )}

            {/* Error del servidor */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
                {serverError}
              </div>
            )}

            {/* Botones de navegacion */}
            <div className="flex justify-between gap-4 pt-2">
              {paso > 0 ? (
                <button
                  type="button"
                  onClick={retroceder}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-semibold hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={16} />
                  Anterior
                </button>
              ) : (
                <Link
                  href="/"
                  className="flex items-center gap-2 px-6 py-3 border-2 border-slate-200 rounded-xl text-slate-600 font-semibold hover:border-slate-300 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Volver
                </Link>
              )}

              {paso < PASOS.length - 1 ? (
                <button
                  type="button"
                  onClick={avanzar}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-xl font-semibold hover:bg-brand-accent-hover transition-colors cursor-pointer"
                >
                  Siguiente
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={enviando}
                  onClick={confirmarRegistro}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {enviando ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      Confirmar Registro
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

