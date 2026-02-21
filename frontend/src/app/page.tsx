import Link from "next/link";
import {
  ShieldCheck,
  UserRound,
  HeartHandshake,
  ArrowRight,
  Activity,
  Clock,
  FileCheck,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-secondary flex flex-col">
      {/* HEADER / NAVBAR */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-primary flex items-center justify-center rounded-xl">
              <ShieldCheck className="text-brand-accent" size={20} />
            </div>
            <span className="text-xl font-black tracking-tighter text-brand-primary">
              Masi<span className="text-brand-accent">Care</span>
            </span>
          </div>
          <Link
            href="/login"
            className="text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-brand-accent/10 text-brand-accent text-xs font-bold px-4 py-2 rounded-full">
            <Activity size={14} />
            Plataforma de Cuidados Domiciliarios
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-brand-primary tracking-tight leading-tight">
            Digitalizando el cuidado{" "}
            <span className="text-brand-accent">artesanal.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Centraliza turnos, informes y pagos de acompañantes terapéuticos en
            un solo lugar. Sin WhatsApp, sin Excel.
          </p>

          {/* CARDS DE REGISTRO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-4">
            {/* Card Cuidador */}
            <Link href="/registro/cuidador" className="group">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-left space-y-4 transition-all hover:border-brand-accent hover:shadow-lg">
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                  <UserRound className="text-brand-accent" size={24} />
                </div>
                <h3 className="text-lg font-bold text-brand-primary">
                  Soy Cuidador
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Registrate como acompañante terapéutico. Gestioná tus turnos,
                  informes y cobros desde un solo panel.
                </p>
                <div className="flex items-center gap-2 text-brand-accent font-semibold text-sm">
                  Postularme
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>

            {/* Card Familiar */}
            <Link href="/registro/familiar" className="group">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 text-left space-y-4 transition-all hover:border-brand-accent hover:shadow-lg">
                <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center">
                  <HeartHandshake className="text-brand-accent" size={24} />
                </div>
                <h3 className="text-lg font-bold text-brand-primary">
                  Soy Familiar
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Registrate como responsable de un paciente. Solicitá servicios
                  de acompañamiento y hacé seguimiento.
                </p>
                <div className="flex items-center gap-2 text-brand-accent font-semibold text-sm">
                  Registrarme
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </Link>
          </div>

          <p className="text-sm text-slate-400 pt-2">
            ¿Ya tenés cuenta?{" "}
            <Link
              href="/login"
              className="text-brand-accent font-bold hover:underline"
            >
              Iniciá sesión acá
            </Link>
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-slate-200 bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-primary text-center mb-10">
            ¿Por qué Masi-Care?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center mx-auto">
                <Clock className="text-brand-accent" size={24} />
              </div>
              <h3 className="font-bold text-brand-primary">
                Turnos en tiempo real
              </h3>
              <p className="text-sm text-slate-500">
                Check-in y check-out digital. Sin llamadas, sin confusiones.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center mx-auto">
                <FileCheck className="text-brand-accent" size={24} />
              </div>
              <h3 className="font-bold text-brand-primary">
                Informes centralizados
              </h3>
              <p className="text-sm text-slate-500">
                Toda la documentación en un solo lugar, accesible al instante.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center mx-auto">
                <ShieldCheck className="text-brand-accent" size={24} />
              </div>
              <h3 className="font-bold text-brand-primary">Pagos transparentes</h3>
              <p className="text-sm text-slate-500">
                Liquidación automática por horas trabajadas. Todo trazable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-brand-primary px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand-accent" size={18} />
            <span className="text-sm font-bold text-white">
              Masi<span className="text-brand-accent">Care</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 MasiCare — Equipo S02-26-Equipo-08
          </p>
        </div>
      </footer>
    </div>
  );
}
