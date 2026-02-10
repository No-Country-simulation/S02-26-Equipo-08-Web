"use client";
import { useState } from "react";
import { User, MapPin, ClipboardList, Edit3, Trash2, ChevronDown, HeartHandshake, Mail } from "lucide-react";
import { Patient } from "@/types/patient";

export function PatientCard({ patient }: { patient: Patient }) {
  // Estado para controlar qué sección está abierta (dir, hist, o family)
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const formatAddress = (addr: any) => {
    if (typeof addr === 'string') return addr;
    return `${addr.calle} ${addr.numero}, ${addr.ciudad}, ${addr.provincia}`;
  };

  return (
    /* self-start es VITAL para que la tarjeta no se estire con las demás */
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden self-start transition-all duration-300 hover:shadow-md">
      
      {/* HEADER FIJO */}
      <div className="p-6 border-b border-slate-50 bg-linear-to-b from-white to-[var(--color-brand-secondary)]">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-[var(--color-brand-primary)] rounded-xl flex items-center justify-center text-white shadow-lg">
            <User size={20} />
          </div>
          <button className="p-2 text-slate-400 hover:text-[var(--color-brand-accent)] transition-colors">
            <Edit3 size={18} />
          </button>
        </div>
        <h3 className="text-lg font-black mt-4 text-[var(--color-brand-primary)] uppercase tracking-tight">
          {patient.namePatient}
        </h3>
        <span className="text-[10px] font-bold bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] px-2 py-0.5 rounded-full">
          DNI: {patient.dniPatient}
        </span>
      </div>

      {/* CONTENEDOR DE SECCIONES */}
      <div className="p-2 space-y-1">
        
        {/* SECCIÓN 1: DIRECCIÓN */}
        <div className="rounded-2xl overflow-hidden">
          <button onClick={() => toggle('dir')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 text-[var(--color-brand-primary)] font-bold text-xs">
              <MapPin size={16} className="text-[var(--color-brand-accent)]" />
              DIRECCIÓN
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openSection === 'dir' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'dir' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="px-11 pb-4 text-xs text-slate-500 font-medium">
                {formatAddress(patient.addressPatient)}
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: HISTORIA CLÍNICA */}
        <div className="rounded-2xl overflow-hidden">
          <button onClick={() => toggle('hist')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 text-[var(--color-brand-primary)] font-bold text-xs">
              <ClipboardList size={16} className="text-[var(--color-brand-accent)]" />
              HISTORIA CLÍNICA
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openSection === 'hist' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'hist' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="px-10 pb-4">
                <div className="bg-slate-50 p-3 rounded-xl border-l-2 border-[var(--color-brand-accent)] text-[11px] text-slate-600 leading-relaxed italic">
                  {patient.medicalHistory}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: FAMILIAR RESPONSABLE (NUEVA) */}
        <div className="rounded-2xl overflow-hidden">
          <button onClick={() => toggle('family')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 text-[var(--color-brand-primary)] font-bold text-xs">
              <HeartHandshake size={16} className="text-[var(--color-brand-accent)]" />
              FAMILIAR RESPONSABLE
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openSection === 'family' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'family' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="px-11 pb-4 space-y-2">
                <div className="flex flex-col">
                  <span className="text-xs font-black text-[var(--color-brand-primary)] uppercase">
                    {patient.responsibleFamily.nameUser}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500 mt-1">
                    <Mail size={12} className="text-[var(--color-brand-accent)]" />
                    <span className="text-[10px] font-medium">{patient.responsibleFamily.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}