"use client";

import { motion } from "motion/react";
import { ArrowRight, UserRound, HeartHandshake } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/40 via-white to-white" />
      <div className="absolute top-0 right-0 w-[60%] h-[80%] bg-gradient-to-bl from-sky-50/50 to-transparent rounded-bl-[120px]" />
      <div className="absolute top-32 left-12 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-sky-100/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-16 lg:pt-32 lg:pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span
                className="text-blue-700"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                Cuidado domiciliario profesional
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-900 mb-6"
              style={{
                fontFamily:
                  "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                fontWeight: 600,
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
              }}
            >
              El cuidado que tu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">
                ser querido
              </span>{" "}
              merece, en casa
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500 mb-10 max-w-lg"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "1.05rem",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              Acompañantes terapéuticos verificados que brindan atención
              personalizada en el hogar. Tu familia informada en todo momento,
              con total tranquilidad.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-start gap-5"
            >
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/registro/cuidador"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/10"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  <UserRound className="w-4 h-4" />
                  Soy Cuidador
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <span
                  className="text-gray-400"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 400,
                  }}
                >
                  Registrate y ofrecé tus servicios
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Link
                  href="/registro/familiar"
                  className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  <HeartHandshake className="w-4 h-4 text-blue-600" />
                  Soy Familiar
                </Link>
                <span
                  className="text-gray-400"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 400,
                  }}
                >
                  Buscá un cuidador para tu ser querido
                </span>
              </div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex items-center gap-8"
            >
              <div>
                <div
                  style={{
                    fontFamily:
                      "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                  className="text-gray-900"
                >
                  +500
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                  }}
                  className="text-gray-400"
                >
                  Familias confían en nosotros
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div
                  style={{
                    fontFamily:
                      "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                  className="text-gray-900"
                >
                  24/7
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                  }}
                  className="text-gray-400"
                >
                  Disponibilidad
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <div
                  style={{
                    fontFamily:
                      "var(--font-playfair), 'Playfair Display', serif",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                  }}
                  className="text-gray-900"
                >
                  100%
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 400,
                  }}
                  className="text-gray-400"
                >
                  Profesionales verificados
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1647913097155-4859fb131dd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZW5pb3IlMjBjb3VwbGUlMjBob2xkaW5nJTIwaGFuZHMlMjBwZWFjZWZ1bHxlbnwxfHx8fDE3NzE2MDI1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cuidado domiciliario profesional"
                className="w-full h-[420px] lg:h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -left-6 bottom-12 bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-5 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <svg
                    width="20"
                    height="20"
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
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                    className="text-gray-900"
                  >
                    Visita completada
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 400,
                    }}
                    className="text-gray-400"
                  >
                    Tu familiar fue atendido con éxito
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
