"use client";

import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "María López",
    role: "Hija de paciente",
    text: "Mi mamá tiene 82 años y vive sola. Desde que contratamos PYMECare, sé que está acompañada por alguien de confianza. Los informes después de cada visita me dan una paz que no tiene precio.",
    stars: 5,
    initials: "ML",
    color: "bg-blue-500",
  },
  {
    name: "Roberto Fernández",
    role: "Esposo de paciente",
    text: "Mi esposa necesita acompañamiento diario y yo trabajo muchas horas. El equipo de PYMECare fue increíble asignando a la persona indicada. Se nota que les importa.",
    stars: 5,
    initials: "RF",
    color: "bg-sky-500",
  },
  {
    name: "Carolina Díaz",
    role: "Nieta de paciente",
    text: "Vivo en otra provincia y mi abuelo está en Buenos Aires. Poder ver los informes de cada guardia me hace sentir que estoy cerca. PYMECare me devolvió la tranquilidad.",
    stars: 5,
    initials: "CD",
    color: "bg-indigo-500",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonios"
      className="py-24 lg:py-32 bg-gray-50/50 relative"
    >
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
            Testimonios
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
            Lo que dicen las familias que confían en nosotros
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <Quote
                className="w-8 h-8 text-blue-100 mb-4"
                fill="currentColor"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-gray-600 flex-1 mb-6"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
                <div
                  className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center`}
                >
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {testimonial.initials}
                  </span>
                </div>
                <div>
                  <p
                    className="text-gray-900"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {testimonial.name}
                  </p>
                  <p
                    className="text-gray-400"
                    style={{
                      fontFamily: "var(--font-inter), 'Inter', sans-serif",
                      fontSize: "0.75rem",
                      fontWeight: 400,
                    }}
                  >
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
