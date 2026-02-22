"use client";

import { motion } from "motion/react";
import {
  HeartHandshake,
  Clock,
  ShieldCheck,
  FileHeart,
  Users,
  Home,
} from "lucide-react";

const services = [
  {
    icon: HeartHandshake,
    title: "Acompañamiento terapéutico",
    description:
      "Profesionales capacitados que brindan compañía, contención emocional y asistencia en las actividades cotidianas de tu ser querido.",
  },
  {
    icon: Clock,
    title: "Turnos flexibles",
    description:
      "Guardias por horas, medio día o jornada completa. Adaptamos el servicio a las necesidades reales de tu familia.",
  },
  {
    icon: ShieldCheck,
    title: "Profesionales verificados",
    description:
      "Cada acompañante pasa por un proceso de verificación documental, certificaciones profesionales y aprobación de nuestro equipo.",
  },
  {
    icon: FileHeart,
    title: "Informes de cada visita",
    description:
      "Después de cada guardia recibís un informe detallado con las actividades realizadas, estado del paciente y observaciones.",
  },
  {
    icon: Users,
    title: "Seguimiento familiar",
    description:
      "Sabé siempre quién cuida a tu ser querido, qué hicieron y cómo se encuentra. Tranquilidad para toda la familia.",
  },
  {
    icon: Home,
    title: "Cuidado en el hogar",
    description:
      "El paciente no necesita moverse. El acompañante va hasta su domicilio, en el entorno donde más cómodo se siente.",
  },
];

export function Services() {
  return (
    <section id="servicios" className="py-24 lg:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
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
            Nuestros servicios
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
            Todo lo que tu familia necesita, en un solo lugar
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
            Brindamos atención domiciliaria integral con profesionales de
            confianza, para que vos y tu familia puedan estar tranquilos.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group p-7 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors duration-300">
                <service.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3
                className="text-gray-900 mb-3"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "1rem",
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                {service.title}
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
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
