"use client";

import { motion } from "motion/react";
import { Send, UserCheck, HeartPulse } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Send,
    title: "Solicitá el servicio",
    description:
      "Contanos qué necesita tu familiar: tipo de acompañamiento, horarios preferidos y cualquier indicación especial. Nosotros nos encargamos del resto.",
  },
  {
    number: "02",
    icon: UserCheck,
    title: "Asignamos al profesional ideal",
    description:
      "Nuestro equipo selecciona al acompañante terapéutico más adecuado según las necesidades del paciente. Vos sabés quién va antes de que llegue.",
  },
  {
    number: "03",
    icon: HeartPulse,
    title: "Tu familiar recibe atención y vos, tranquilidad",
    description:
      "El acompañante realiza la visita, registra las actividades y genera un informe. Vos lo recibís para estar siempre al tanto.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50/30 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-blue-600 mb-4"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Así de simple
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
            En tres pasos, tu familiar está cuidado
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-gray-400"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Sin complicaciones. Sin papeleos interminables. Solo el cuidado que
            necesitás.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-14 right-0 translate-x-1/2 w-full h-px bg-gradient-to-r from-gray-200 to-gray-100 z-0" />
              )}

              <div className="relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className="text-gray-100 select-none"
                    style={{
                      fontFamily:
                        "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: "3rem",
                      fontWeight: 700,
                      lineHeight: 1,
                    }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3
                  className="text-gray-900 mb-3"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-gray-400"
                  style={{
                    fontFamily: "var(--font-inter), 'Inter', sans-serif",
                    fontSize: "0.875rem",
                    lineHeight: 1.7,
                    fontWeight: 300,
                  }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
