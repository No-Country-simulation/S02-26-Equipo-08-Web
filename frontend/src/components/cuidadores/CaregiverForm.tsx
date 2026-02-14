"use client";
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // <--- Importamos el router
import { 
  User, Phone, IdCard, MapPin, Wallet, 
  Save, X, CheckCircle2, Mail, Lock, Loader2 
} from "lucide-react";
import { Caregiver } from "@/src/types/caregiver";
import { createCaregiverAction } from "@/src/actions/cudadores";

interface CaregiverFormProps {
  initialData?: Caregiver;
 // onClose: () => void;
}

export function CaregiverForm({ initialData }: CaregiverFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter(); // <--- Inicializamos el router
  
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: initialData || {
      addressCaregiver: {
        estado: "Peru",
        piso: "1"
      }
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Agregamos el array de documentos que la API requiere por defecto
      const finalData = {
        ...data,
        documents: [
          { 
            tipoDoc: "DNI_FRENTE", 
            enlaceUrl: "https://storage.masi.com/docs/default.jpg", 
            fechaSubida: new Date().toISOString().split('T')[0] 
          }
        ]
      };
      
      const result = await createCaregiverAction(finalData);
      if (result.success) {
        console.log(" resultado ", result)
       // En lugar de onClose(), usamos router.push para volver a la tabla
        router.push("/admin/dashboard/cuidadores");
        router.refresh();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      
      {/* SECCIÓN 1: CREDENCIALES (NUEVO Y OBLIGATORIO) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-brand-accent/10 rounded-lg">
            <Lock size={18} className="text-brand-accent" />
          </div>
          <h4 className="text-sm font-black text-brand-primary uppercase tracking-tight">Acceso al Sistema</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">EMAIL INSTITUCIONAL</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                {...register("email", { required: true })}
                type="email"
                className="w-full p-3 pl-10 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30"
                placeholder="elena.ruiz@masi.com"
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">CONTRASEÑA TEMPORAL</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                {...register("password", { required: true })}
                type="password"
                className="w-full p-3 pl-10 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 2: INFORMACIÓN PERSONAL */}
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
              className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">APELLIDO</label>
            <input 
              {...register("lastName", { required: true })}
              className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">DNI</label>
            <input 
              {...register("dni", { required: true })}
              className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30 font-mono"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1">TELÉFONO</label>
            <input 
              {...register("phone", { required: true })}
              className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30"
            />
          </div>
        </div>
      </section>

      {/* SECCIÓN 3: DIRECCIÓN Y FINANZAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-brand-accent/10 rounded-lg">
              <MapPin size={18} className="text-brand-accent" />
            </div>
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-tight">Residencia</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input {...register("addressCaregiver.ciudad")} placeholder="Ciudad" className="p-3 rounded-xl border border-slate-200 text-sm focus:border-brand-primary outline-none" />
            <input {...register("addressCaregiver.distrito")} placeholder="Distrito" className="p-3 rounded-xl border border-slate-200 text-sm focus:border-brand-primary outline-none" />
            <input {...register("addressCaregiver.calle")} placeholder="Calle / Av." className="col-span-2 p-3 rounded-xl border border-slate-200 text-sm focus:border-brand-primary outline-none" />
            <input {...register("addressCaregiver.numero")} placeholder="Número" className="p-3 rounded-xl border border-slate-200 text-sm focus:border-brand-primary outline-none" />
            <input {...register("addressCaregiver.piso")} placeholder="Piso / Dpto" className="p-3 rounded-xl border border-slate-200 text-sm focus:border-brand-primary outline-none" />
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <div className="p-1.5 bg-brand-accent/10 rounded-lg">
              <Wallet size={18} className="text-brand-accent" />
            </div>
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-tight">Pagos</h4>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">Alias / CVU</label>
            <input 
              {...register("cvu_alias", { required: true })}
              placeholder="elena.cuidados.masi"
              className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-primary outline-none transition-all bg-brand-secondary/30 font-mono text-brand-accent"
            />
          </div>
        </section>
      </div>

      {/* BOTONES */}
      <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-xl shadow-brand-primary/20 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {initialData ? 'ACTUALIZAR DATOS' : 'GUARDAR CUIDADOR'}
        </button>
        <button 
          type="button"
          onClick={() => router.back()} // <--- Cambiado de onClose a router.back()
          className="px-8 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all uppercase text-xs tracking-widest"
        >

  
          Cancelar
        </button>
      </div>
    </form>
  );
}