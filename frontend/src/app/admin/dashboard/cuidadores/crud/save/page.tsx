import { CaregiverForm } from "@/src/components/cuidadores/CaregiverForm";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";

export default function SaveCaregiverPage() {
  return (
    <main className="min-h-screen bg-brand-secondary/40 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* NAVEGACIÓN SUPERIOR */}
        <div className="flex justify-between items-center">
          <Link 
            href="/admin/dashboard/cuidadores" 
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-brand-primary transition-all uppercase tracking-[0.2em]"
          >
            <ArrowLeft size={14} className="text-brand-accent" /> 
            Volver al listado
          </Link>
          
          <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
            Módulo de Recursos Humanos
          </div>
        </div>

        {/* ENCABEZADO DE PÁGINA */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-brand-primary rounded-[2rem] flex items-center justify-center text-brand-secondary shadow-2xl shadow-brand-primary/20">
            <UserPlus size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-brand-primary tracking-tighter uppercase leading-none">
              Registrar <span className="text-brand-accent italic">Cuidador</span>
            </h1>
            <p className="text-slate-400 font-medium mt-2 text-sm">
              Complete los campos obligatorios para generar las credenciales de acceso al sistema.
            </p>
          </div>
        </div>

       {/* CONTENEDOR DEL FORMULARIO - AHORA SIN EL ERROR */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-brand-primary/5">
          <CaregiverForm /> 
        </div>

        {/* FOOTER INFORMATIVO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-slate-200 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Paso 01</p>
            <p className="text-[11px] font-bold text-brand-primary">Alta de Usuario</p>
          </div>
          <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-slate-200 text-center opacity-50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Paso 02</p>
            <p className="text-[11px] font-bold text-brand-primary">Validación de DNI</p>
          </div>
          <div className="p-4 bg-white/50 rounded-2xl border border-dashed border-slate-200 text-center opacity-50">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Paso 03</p>
            <p className="text-[11px] font-bold text-brand-primary">Carga de Certificados</p>
          </div>
        </div>

      </div>
    </main>
  );
}