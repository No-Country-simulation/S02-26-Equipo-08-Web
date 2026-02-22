"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, X, Heart } from "lucide-react";
import Link from "next/link";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Inicio", href: "#hero" },
    { label: "Servicios", href: "#servicios" },
    { label: "Por qué elegirnos", href: "#por-que" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Testimonios", href: "#testimonios" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#hero" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-md">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span
              className="tracking-tight text-gray-900"
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "1.35rem",
                fontWeight: 600,
              }}
            >
              Masi-Care
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-500 hover:text-gray-900 transition-colors duration-200"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              Iniciar Sesión
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
        >
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block text-gray-600 hover:text-gray-900 transition-colors"
                style={{
                  fontFamily: "var(--font-inter), 'Inter', sans-serif",
                  fontSize: "0.95rem",
                  fontWeight: 400,
                }}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="block w-full text-center px-5 py-3 rounded-full text-white bg-gray-900 mt-4"
              style={{
                fontFamily: "var(--font-inter), 'Inter', sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
              onClick={() => setIsOpen(false)}
            >
              Iniciar Sesión
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
