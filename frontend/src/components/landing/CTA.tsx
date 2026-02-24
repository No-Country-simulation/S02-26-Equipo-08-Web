"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  Heart,
  Phone,
  Mail,
  MapPin,
  UserRound,
  HeartHandshake,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function CTA() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section
      id="contacto"
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-50/60 via-sky-50/40 to-indigo-50/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>

            <h2
              className="text-gray-900 mb-5"
              style={{
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                fontWeight: 600,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              ¿Necesitás un acompañante para tu familiar?
            </h2>

            <p
              className="text-gray-400 mb-10"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              Dejanos tus datos y nos ponemos en contacto para entender qué
              necesita tu familia y asignar al profesional indicado. Sin
              compromiso.
            </p>

            {/* Contact info */}
            <div className="space-y-5 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.78rem",
                      fontWeight: 400,
                    }}
                    className="text-gray-400"
                  >
                    Llamanos
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                    className="text-gray-900"
                  >
                    +54 11 0000-0000
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.78rem",
                      fontWeight: 400,
                    }}
                    className="text-gray-400"
                  >
                    Escribinos
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                    className="text-gray-900"
                  >
                    contacto@masi-care.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.78rem",
                      fontWeight: 400,
                    }}
                    className="text-gray-400"
                  >
                    Cobertura
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.9rem",
                      fontWeight: 500,
                    }}
                    className="text-gray-900"
                  >
                    Buenos Aires y alrededores
                  </p>
                </div>
              </div>
            </div>

            {/* Registration links */}
            <div className="border-t border-gray-100 pt-8">
              <p
                className="text-gray-500 mb-4"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                }}
              >
                ¿Querés ser parte de nuestra red?
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/registro/cuidador"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  <UserRound className="w-4 h-4" />
                  Registrarme como Cuidador
                </Link>
                <Link
                  href="/registro/familiar"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                  }}
                >
                  <HeartHandshake className="w-4 h-4" />
                  Registrarme como Familiar
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {submitted ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>
                <h3
                  className="text-gray-900 mb-2"
                  style={{
                    fontFamily:
                      "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: "1.4rem",
                    fontWeight: 600,
                  }}
                >
                  ¡Recibimos tu solicitud!
                </h3>
                <p
                  className="text-gray-400"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  Nos vamos a comunicar con vos en las próximas 24 horas para
                  coordinar todo.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/40 p-8 space-y-5"
              >
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: María García"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    Teléfono de contacto
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 11 2345-6789"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="Ej: maria@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>
                <div>
                  <label
                    className="block text-gray-700 mb-2"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.82rem",
                      fontWeight: 500,
                    }}
                  >
                    ¿Qué necesita tu familiar?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contanos brevemente la situación: edad del paciente, tipo de acompañamiento, horarios..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.88rem",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="group w-full inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/10"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  Solicitar servicio
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <p
                  className="text-center text-gray-300"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                  }}
                >
                  Sin compromiso. Te contactamos en menos de 24 horas.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
