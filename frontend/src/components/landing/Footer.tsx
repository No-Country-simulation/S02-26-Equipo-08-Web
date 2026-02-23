import { Heart } from "lucide-react";
import Link from "next/link";

type FooterLink = { label: string; href: string; isRoute?: boolean };

const footerLinks: Record<string, FooterLink[]> = {
  Servicios: [
    { label: "Acompañamiento terapéutico", href: "#servicios" },
    { label: "Cuidado domiciliario", href: "#servicios" },
    { label: "Guardias por turno", href: "#servicios" },
    { label: "Cuidado nocturno", href: "#servicios" },
  ],
  "Para familias": [
    { label: "Solicitar servicio", href: "#contacto" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Testimonios", href: "#testimonios" },
    { label: "Registrarme como Familiar", href: "/registro/familiar", isRoute: true },
  ],
  "Para profesionales": [
    { label: "Registrarme como Cuidador", href: "/registro/cuidador", isRoute: true },
    { label: "Requisitos", href: "#por-que" },
    { label: "Beneficios", href: "#por-que" },
    { label: "Por qué elegirnos", href: "#por-que" },
  ],
  Empresa: [
    { label: "Sobre PYMECare", href: "#hero" },
    { label: "Contacto", href: "#contacto" },
    { label: "Iniciar Sesión", href: "/login", isRoute: true },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span
                className="text-gray-900"
                style={{
                  fontFamily:
                    "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "1.15rem",
                  fontWeight: 600,
                }}
              >
                PYMECare
              </span>
            </div>
            <p
              className="text-gray-400 mb-6"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "0.82rem",
                lineHeight: 1.7,
                fontWeight: 300,
              }}
            >
              Cuidado domiciliario profesional para tu familia. Acompañantes
              terapéuticos verificados.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-gray-900 mb-4"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.isRoute ? (
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 400,
                        }}
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        style={{
                          fontFamily: "var(--font-inter), 'Inter', sans-serif",
                          fontSize: "0.8rem",
                          fontWeight: 400,
                        }}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-gray-400"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "0.78rem",
              fontWeight: 400,
            }}
          >
            &copy; 2026 PYMECare. Todos los derechos reservados.
          </p>
          <p
            className="text-gray-300"
            style={{
              fontFamily: "var(--font-inter), 'Inter', sans-serif",
              fontSize: "0.75rem",
              fontWeight: 400,
            }}
          >
            Hecho con cuidado, para quienes cuidan.
          </p>
        </div>
      </div>
    </footer>
  );
}
