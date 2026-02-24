"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Heart,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { solicitarRecuperacionAction } from "@/src/actions/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [enviadoExitoso, setEnviadoExitoso] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setServerError(null);

    const formData = new FormData();
    formData.set("email", email);

    try {
      const result = await solicitarRecuperacionAction(formData);
      if (result?.error) {
        setServerError(result.error);
      } else {
        setEnviadoExitoso(true);
      }
    } catch (error) {
      setServerError("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const inputBase = "w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all bg-white text-gray-900";

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row bg-white"
      style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}
    >
      {/* PANEL IZQUIERDO: BRANDING (Igual al registro) */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] bg-[#011627] relative overflow-hidden flex-col justify-between p-10">
        <div className="absolute top-[-20%] right-[-30%] w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-15" />
        <div className="absolute bottom-[-20%] left-[-20%] w-80 h-80 bg-sky-400 rounded-full blur-[140px] opacity-10" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-md">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="text-white tracking-tight" style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.3rem", fontWeight: 600 }}>
              PYMECare
            </span>
          </Link>

          <h2 className="text-white mb-3" style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.85rem", fontWeight: 600, lineHeight: 1.3 }}>
            Recuperá el acceso a tu cuenta
          </h2>
          <p className="text-gray-400 mb-12" style={{ fontSize: "0.88rem", lineHeight: 1.7 }}>
            No te preocupes, a todos nos pasa. Ingresá tu correo y te ayudaremos a restablecer tu contraseña en unos segundos.
          </p>
        </div>

        <div className="relative z-10 pt-8 border-t border-white/10">
          <p className="text-gray-500 text-xs">
            ¿Necesitás soporte técnico? <span className="text-blue-400">Contactanos</span>
          </p>
        </div>
      </div>

      {/* PANEL DERECHO: FORMULARIO */}
      <div className="flex-1 flex items-center justify-center px-6 py-10 lg:py-16">
        <div className="w-full max-w-md">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/30 p-8"
          >
            {!enviadoExitoso ? (
              <>
                <div className="mb-8">
                  <h1 className="text-gray-900 mb-2" style={{ fontFamily: "var(--font-playfair), serif", fontSize: "1.65rem", fontWeight: 600 }}>
                    ¿Olvidaste tu contraseña?
                  </h1>
                  <p className="text-gray-500 text-sm">
                    Enviaremos un enlace de recuperación a tu casilla de correo.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1.5">Email registrado</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={17} />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
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
                    className="w-full bg-gray-900 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {enviando ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Enviar enlace
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
                  ¡Correo enviado!
                </h2>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Si <b>{email}</b> está registrado en PYMECare, recibirás un mensaje con los pasos para cambiar tu contraseña.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-blue-500 font-medium hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft size={16} /> Volver al Login
                </Link>
              </div>
            )}
          </motion.div>

          {!enviadoExitoso && (
            <div className="mt-8 text-center">
              <Link href="/login" className="text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2 text-sm">
                <ArrowLeft size={16} /> Volver al inicio de sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}