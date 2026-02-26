"use client";

import { useState, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Lock,
  Heart,
  Loader2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";

// Definimos la interfaz para los props según los nuevos requerimientos de Next.js 15
interface ResetPageProps {
  searchParams: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ searchParams }: ResetPageProps) {
  // SOLUCIÓN AL ERROR: Desenvolvemos la promesa de searchParams
  const resolvedSearchParams = use(searchParams);
  const token = resolvedSearchParams.token;

  // Estados del formulario
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [exitoso, setExitoso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setServerError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);
    setServerError(null);

    try {
      const res = await fetch("http://localhost:8001/api/login/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token: token, 
          password: password 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al actualizar");
      }

      setExitoso(true);
    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setEnviando(false);
    }
  };
  
  const inputBase = "w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white text-gray-900";

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white" style={{ fontFamily: "var(--font-inter), sans-serif" }}>
      
      {/* PANEL IZQUIERDO: BRANDING (Coherente con ForgotPassword) */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] bg-[#011627] relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute top-[-20%] right-[-30%] w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-15" />
        <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-sky-400 rounded-full blur-[140px] opacity-10" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-white tracking-tight font-bold text-xl" style={{ fontFamily: "var(--font-playfair), serif" }}>
              PYMECare
            </span>
          </Link>

          <h2 className="text-white mb-3 text-3xl font-semibold leading-tight" style={{ fontFamily: "var(--font-playfair), serif" }}>
            Restablecé tu seguridad
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-12">
            Ingresá tu nueva contraseña. Asegurate de que sea robusta para mantener tus datos protegidos.
          </p>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10 text-gray-500 text-xs flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-400" />
          Proceso de recuperación cifrado
        </div>
      </div>

      {/* PANEL DERECHO: FORMULARIO */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30 p-8"
          >
            {!exitoso ? (
              <>
                <div className="mb-8">
                  <h1 className="text-gray-900 mb-2 text-2xl font-bold" style={{ fontFamily: "var(--font-playfair), serif" }}>
                    Nueva contraseña
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Por favor, completá los campos para actualizar tu clave.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Nueva contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Confirmar contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={inputBase}
                      />
                    </div>
                  </div>

                  {serverError && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl text-xs font-medium">
                      {serverError}
                    </div>
                  )}

                  <button
                    disabled={enviando}
                    className="w-full bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {enviando ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <>
                        Actualizar Contraseña
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-emerald-500" size={32} />
                </div>
                <h2 className="text-gray-900 text-xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  ¡Clave actualizada!
                </h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Tu contraseña ha sido cambiada correctamente. Ya podés volver a ingresar a tu cuenta.
                </p>
                <Link
                  href="/login"
                  className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                >
                  Iniciar Sesión <ArrowRight size={18} />
                </Link>
              </div>
            )}
          </motion.div>
          
          <div className="mt-8 text-center">
            <Link href="/login" className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 text-sm">
              <ArrowLeft size={16} /> Volver al portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}