"use client";

import { motion } from "motion/react";

const stats = [
  {
    value: "+500",
    label: "Familias atendidas",
    description: "que confían en nuestro servicio",
  },
  {
    value: "+80",
    label: "Profesionales verificados",
    description: "con documentación y certificaciones",
  },
  {
    value: "24/7",
    label: "Disponibilidad",
    description: "guardias en cualquier horario",
  },
  {
    value: "98%",
    label: "Satisfacción",
    description: "de las familias que nos eligen",
  },
];

export function Stats() {
  return (
    <section className="py-24 lg:py-28 bg-brand-primary relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-white mb-4"
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 600,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Números que hablan de confianza
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "1rem",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Cada número representa una familia que eligió estar tranquila.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-400 mb-2"
                style={{
                  fontFamily:
                    "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "3rem",
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                {stat.value}
              </div>
              <p
                className="text-white mb-1"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </p>
              <p
                className="text-gray-500"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 300,
                }}
              >
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
