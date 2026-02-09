"use client";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { 
  User, Phone, IdCard, MapPin, Wallet, 
  Save, X, CheckCircle2, AlertCircle 
} from "lucide-react";
import { Caregiver } from "@/src/types/caregiver";

interface CaregiverFormProps {
  initialData?: Caregiver;
  onClose: () => void;
   onEdit:() => void;
  ondeDelete:()=>void;
}

export function CaregiverForm({ initialData, onClose }: CaregiverFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Inicialización del formulario con react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Caregiver>>({
    defaultValues: initialData || {
      addressCaregiver: {
        estado: "Perú" // Valor por defecto
      }
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Simulación de envío a tu API de Node.js
      console.log("Enviando a http://localhost:5000/api/caregivers", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* SECCIÓN: INFORMACIÓN PERSONAL */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-brand-accent/10 rounded-lg">
            <User size={18} className="text-brand-accent" />
          </div>
          <h4 className="text-sm font-black text-brand-primary uppercase tracking-tight">Datos Personales</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">NOMBRE</label>
            <input 
              {...register("firstName", { required: true })}
              className={`w-full p-3 rounded-xl border-2 bg-brand-secondary/30 outline-none transition-all ${errors.firstName ? 'border-brand-accent' : 'border-slate-100 focus:border-brand-primary'}`}
              placeholder="Nombre del cuidador"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">APELLIDO</label>
            <input 
              {...register("lastName", { required: true })}
              className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30"
              placeholder="Apellido del cuidador"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">DNI (IDENTIFICACIÓN)</label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                {...register("dni", { required: true })}
                className="w-full p-3 pl-10 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30 font-mono"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">TELÉFONO DE CONTACTO</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                {...register("phone", { required: true })}
                className="w-full p-3 pl-10 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: UBICACIÓN Y PAGOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* DIRECCIÓN */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-brand-accent/10 rounded-lg">
              <MapPin size={18} className="text-brand-accent" />
            </div>
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-tight">Residencia</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input {...register("addressCaregiver.calle")} placeholder="Calle / Av." className="col-span-2 p-3 rounded-xl border border-slate-200 text-sm focus:ring-1 focus:ring-brand-primary outline-none" />
            <input {...register("addressCaregiver.numero")} placeholder="N°" className="p-3 rounded-xl border border-slate-200 text-sm" />
            <input {...register("addressCaregiver.distrito")} placeholder="Distrito" className="p-3 rounded-xl border border-slate-200 text-sm" />
          </div>
        </section>

        {/* FINANZAS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-brand-accent/10 rounded-lg">
              <Wallet size={18} className="text-brand-accent" />
            </div>
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-tight">Pagos (Mercado Pago)</h4>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">CVU O ALIAS</label>
            <input 
              {...register("cvu_alias")}
              placeholder="nombre.pago.mp"
              className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30 font-mono text-brand-accent"
            />
          </div>
        </section>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex items-center gap-4 pt-6">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-xl shadow-brand-primary/20 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} />
              {initialData ? 'ACTUALIZAR CUIDADOR' : 'REGISTRAR CUIDADOR'}
            </>
          )}
        </button>
        <button 
          type="button"
          onClick={onClose}
          className="px-8 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
        >
          Cancelar
        </button>
      </div>

      {/* NOTA INFORMATIVA */}
      {!initialData && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <CheckCircle2 size={18} className="text-emerald-500 mt-0.5" />
          <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
            Al registrar al cuidador, se le asignará un <strong>userId</strong> automáticamente. El sistema le enviará un correo para que pueda subir su documentación legal (DNI y Certificados) desde su panel.
          </p>
        </div>
      )}
    </form>
  );
}