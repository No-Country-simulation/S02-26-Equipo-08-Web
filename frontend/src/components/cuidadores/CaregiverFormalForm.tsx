"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { createCaregiverAction } from "@/src/actions/cudadores";
import { 
  Shield, User, MapPin, CreditCard, 
  ChevronRight, Loader2, AlertCircle 
} from "lucide-react";

export function CaregiverFormalForm() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setServerError(null);

    // Ajustamos la estructura exacta que pide tu API de Node
    const payload = {
      ...data,
      documents: [
        { 
          tipoDoc: "DNI_FRENTE", 
          enlaceUrl: "https://storage.masi.com/docs/default.jpg", 
          fechaSubida: "2026-02-09" 
        }
      ]
    };

    const result = await createCaregiverAction(payload);

    if (result?.error) {
      setServerError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/dashboard/cuidadores");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[700px] bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-200">
      
      {/* LATERAL IZQUIERDO: Branding y Status */}
      <div className="lg:w-80 bg-brand-primary p-10 text-white flex flex-col justify-between">
        <div className="space-y-12">
          <div className="italic font-black text-2xl tracking-tighter">
            MASI <span className="text-brand-accent">ADMIN</span>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4 text-brand-accent">
              <Shield size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Seguridad</span>
            </div>
            <div className="flex items-center gap-4 text-white/40">
              <User size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Identidad</span>
            </div>
            <div className="flex items-center gap-4 text-white/40">
              <MapPin size={20} />
              <span className="text-xs font-black uppercase tracking-widest">Dirección</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <p className="text-[10px] font-bold text-white/40 uppercase mb-2">Endpoint API</p>
          <code className="text-[10px] text-brand-accent break-all">api/caregivers/save</code>
        </div>
      </div>

      {/* CUERPO DEL FORMULARIO */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-8 lg:p-16 space-y-12 bg-white">
        
        {serverError && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-pulse">
            <AlertCircle size={18} /> {serverError}
          </div>
        )}

        {/* GRUPO 1: CUENTA */}
        <div className="space-y-6">
          <h3 className="text-brand-primary font-black text-sm uppercase tracking-tighter border-l-4 border-brand-accent pl-4">
            Credenciales de Acceso
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Email</label>
              <input {...register("email", { required: true })} type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Password</label>
              <input {...register("password", { required: true })} type="password" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-medium" />
            </div>
          </div>
        </div>

        {/* GRUPO 2: PERFIL */}
        <div className="space-y-6">
          <h3 className="text-brand-primary font-black text-sm uppercase tracking-tighter border-l-4 border-brand-accent pl-4">
            Perfil del Cuidador
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Nombres</label>
              <input {...register("firstName", { required: true })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Apellidos</label>
              <input {...register("lastName", { required: true })} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-brand-primary outline-none transition-all text-sm font-medium" />
            </div>
          </div>
        </div>

        {/* GRUPO 3: UBICACIÓN */}
        <div className="space-y-6">
          <h3 className="text-brand-primary font-black text-sm uppercase tracking-tighter border-l-4 border-brand-accent pl-4">
            Domicilio
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Calle</label>
              <input {...register("addressCaregiver.calle")} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-brand-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Nro</label>
              <input {...register("addressCaregiver.numero")} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-brand-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase">Ciudad</label>
              <input {...register("addressCaregiver.ciudad")} defaultValue="Huancayo" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-brand-primary" />
            </div>
          </div>
        </div>

        {/* BOTÓN DE ACCIÓN */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 max-w-[240px] leading-tight font-medium uppercase">
            Asegúrese de que los datos coincidan con el documento de identidad oficial.
          </p>
          <button 
            disabled={loading}
            className="px-12 py-5 bg-brand-primary text-white rounded-[2rem] font-black hover:bg-brand-accent transition-all shadow-xl shadow-brand-primary/20 flex items-center gap-3 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
            FINALIZAR REGISTRO
          </button>
        </div>
      </form>
    </div>
  );
}