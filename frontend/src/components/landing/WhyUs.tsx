"use client";

import { motion } from "motion/react";
import { ImageWithFallback } from "./ImageWithFallback";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "Profesionales con documentación verificada",
    description:
      "Cada acompañante presenta certificaciones, antecedentes y documentación legal antes de ser habilitado.",
  },
  {
    title: "Informes transparentes después de cada visita",
    description:
      "Sabés exactamente qué pasó durante la guardia. Recibís un reporte con actividades, estado y observaciones.",
  },
  {
    title: "Asignación personalizada",
    description:
      "No asignamos cualquier profesional. Nuestro equipo selecciona al acompañante más adecuado según las necesidades del paciente.",
  },
  {
    title: "Seguimiento continuo para la familia",
    description:
      "Como familiar, podés ver quién atiende a tu ser querido, leer los informes y estar tranquilo sin importar la distancia.",
  },
  {
    title: "Flexibilidad horaria total",
    description:
      "Desde unas horas puntuales hasta cuidado de jornada completa. Vos definís cuándo y cuánto tiempo.",
  },
];

export function WhyUs() {
  return (
    <section id="por-que" className="py-24 lg:py-32 bg-gray-50/50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758686254593-7c4cd55b2621?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwd29tYW4lMjBzbWlsaW5nJTIwd2FybSUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MTYwMjU0Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Paciente feliz recibiendo cuidado en casa"
                className="w-full h-[400px] lg:h-[520px] object-cover"
              />
            </div>

            {/* Floating stat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -right-4 lg:-right-6 bottom-8 bg-white rounded-2xl shadow-xl shadow-gray-200/60 p-5 border border-gray-100"
            >
              <div
                className="text-blue-600 mb-1"
                style={{
                  fontFamily:
                    "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "2rem",
                  fontWeight: 700,
                }}
              >
                98%
              </div>
              <p
                className="text-gray-500"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 400,
                }}
              >
                Familias satisfechas
              </p>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p
              className="text-blue-600 mb-4"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Por qué elegirnos
            </p>
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
              Porque cuidar a alguien es un acto de confianza
            </h2>
            <p
              className="text-gray-400 mb-10"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "1rem",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              Sabemos que dejar el cuidado de un familiar en manos de alguien
              más no es fácil. Por eso nos aseguramos de que cada detalle esté
              cubierto.
            </p>

            <div className="space-y-5">
              {reasons.map((reason, index) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex gap-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4
                      className="text-gray-900 mb-1"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                      }}
                    >
                      {reason.title}
                    </h4>
                    <p
                      className="text-gray-400"
                      style={{
                        fontFamily: "var(--font-inter), 'Inter', sans-serif",
                        fontSize: "0.83rem",
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {reason.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
