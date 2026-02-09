"use client";
import { useState } from "react";
import { 
  UserCircle, Phone, MapPin, Wallet, FileCheck, 
  ChevronDown, ExternalLink, ShieldCheck 
} from "lucide-react";
import { Caregiver } from "@/src/types/caregiver";

export function CaregiverCard({ caregiver }: { caregiver: Caregiver }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggle = (section: string) => setOpenSection(openSection === section ? null : section);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden self-start transition-all hover:shadow-md">
      
      {/* HEADER: Perfil Profesional */}
      <div className="p-6 border-b border-slate-50 bg-linear-to-b from-white to-brand-secondary">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
            <UserCircle size={28} />
          </div>
          <span className="text-[10px] font-black px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1">
            <ShieldCheck size={12} /> VERIFICADO
          </span>
        </div>
        <h3 className="text-lg font-black mt-4 text-brand-primary uppercase tracking-tight leading-tight">
          {caregiver.firstName} {caregiver.lastName}
        </h3>
        <div className="flex flex-col gap-1 mt-2">
           <span className="text-xs font-bold text-slate-400">DNI: {caregiver.dni}</span>
           <div className="flex items-center gap-2 text-brand-accent font-bold text-sm">
              <Phone size={14} />
              {caregiver.phone}
           </div>
        </div>
      </div>

      {/* SECCIONES DESPLEGABLES */}
      <div className="p-2 space-y-1">
        
        {/* DIRECCIÓN */}
        <div className="rounded-2xl overflow-hidden">
          <button onClick={() => toggle('dir')} className="w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors">
            <div className="flex items-center gap-3 text-brand-primary font-bold text-xs uppercase">
              <MapPin size={16} className="text-brand-accent" /> Ubicación
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openSection === 'dir' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'dir' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="px-11 pb-4 text-xs text-slate-500 italic">
                {caregiver.addressCaregiver.calle ? (
                  `${caregiver.addressCaregiver.calle} ${caregiver.addressCaregiver.numero}, ${caregiver.addressCaregiver.distrito}, ${caregiver.addressCaregiver.ciudad}`
                ) : "Dirección no cargada"}
              </div>
            </div>
          </div>
        </div>

        {/* PAGO (CVU/ALIAS) */}
        <div className="rounded-2xl overflow-hidden">
          <button onClick={() => toggle('pay')} className="w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors">
            <div className="flex items-center gap-3 text-brand-primary font-bold text-xs uppercase">
              <Wallet size={16} className="text-brand-accent" /> Datos de Pago
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openSection === 'pay' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'pay' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="px-11 pb-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Alias/CVU Mercado Pago</span>
                  <span className="text-sm font-mono text-brand-primary break-all">{caregiver.cvu_alias || "No registrado"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DOCUMENTACIÓN */}
        <div className="rounded-2xl overflow-hidden">
          <button onClick={() => toggle('docs')} className="w-full flex items-center justify-between p-4 hover:bg-brand-secondary transition-colors">
            <div className="flex items-center gap-3 text-brand-primary font-bold text-xs uppercase">
              <FileCheck size={16} className="text-brand-accent" /> Documentación
            </div>
            <ChevronDown size={16} className={`text-slate-400 transition-transform duration-300 ${openSection === 'docs' ? 'rotate-180' : ''}`} />
          </button>
          <div className={`grid transition-all duration-300 ease-in-out ${openSection === 'docs' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="px-11 pb-4 space-y-2">
                {caregiver.documents.map((doc, idx) => (
                  <a 
                    key={idx} 
                    href={doc.enlaceUrl} 
                    target="_blank"
                    className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-lg hover:border-brand-accent transition-colors group/item"
                  >
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{doc.tipoDoc.replace('_', ' ')}</span>
                    <ExternalLink size={14} className="text-slate-300 group-hover/item:text-brand-accent" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}