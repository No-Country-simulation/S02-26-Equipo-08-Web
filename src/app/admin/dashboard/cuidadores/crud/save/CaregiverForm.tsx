"use client";
import { useForm } from "react-hook-form";
import { User, Phone, IdCard, MapPin, Wallet, Save, X } from "lucide-react";
import { Caregiver } from "@/src/types/caregiver";

interface CaregiverFormProps {
  initialData?: Caregiver;
  onClose: () => void;
}

export function CaregiverForm({ initialData, onClose }: CaregiverFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: initialData || {}
  });

  const onSubmit = (data: any) => {
    console.log("Datos para la API de Node.js:", data);
    // Aquí llamarías a tu Server Action de POST o PUT
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Nombre */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-primary flex items-center gap-2">
            <User size={14} className="text-brand-accent" /> NOMBRE
          </label>
          <input 
            {...register("firstName")}
            className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-accent outline-none transition-all bg-brand-secondary/30"
            placeholder="Ej: Richard"
          />
        </div>

        {/* Apellido */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-primary flex items-center gap-2">
            <User size={14} className="text-brand-accent" /> APELLIDO
          </label>
          <input 
            {...register("lastName")}
            className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-accent outline-none transition-all bg-brand-secondary/30"
            placeholder="Ej: Díaz"
          />
        </div>

        {/* DNI */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-primary flex items-center gap-2">
            <IdCard size={14} className="text-brand-accent" /> DNI
          </label>
          <input 
            {...register("dni")}
            className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-accent outline-none transition-all bg-brand-secondary/30"
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label className="text-xs font-black text-brand-primary flex items-center gap-2">
            <Phone size={14} className="text-brand-accent" /> TELÉFONO
          </label>
          <input 
            {...register("phone")}
            className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-accent outline-none transition-all bg-brand-secondary/30"
          />
        </div>
      </div>

      {/* Sección Dirección */}
      <div className="p-4 bg-brand-secondary rounded-2xl border border-slate-100 space-y-4">
        <h4 className="text-xs font-black text-brand-primary flex items-center gap-2 border-b border-slate-200 pb-2">
          <MapPin size={14} className="text-brand-accent" /> UBICACIÓN RESIDENCIAL
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input {...register("addressCaregiver.calle")} placeholder="Calle" className="col-span-2 p-2 rounded-lg border border-slate-200 text-sm" />
          <input {...register("addressCaregiver.numero")} placeholder="N°" className="p-2 rounded-lg border border-slate-200 text-sm" />
          <input {...register("addressCaregiver.distrito")} placeholder="Distrito" className="p-2 rounded-lg border border-slate-200 text-sm" />
        </div>
      </div>

      {/* Pago */}
      <div className="space-y-2">
        <label className="text-xs font-black text-brand-primary flex items-center gap-2">
          <Wallet size={14} className="text-brand-accent" /> ALIAS / CVU (MERCADO PAGO)
        </label>
        <input 
          {...register("cvu_alias")}
          className="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-brand-accent outline-none transition-all bg-brand-secondary/30 font-mono"
          placeholder="richard.pago.mp"
        />
      </div>

      {/* Acciones */}
      <div className="flex gap-4 pt-4">
        <button 
          type="submit"
          className="flex-1 bg-brand-primary text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-brand-accent transition-all shadow-lg active:scale-95"
        >
          <Save size={20} /> GUARDAR CUIDADOR
        </button>
        <button 
          type="button"
          onClick={onClose}
          className="px-6 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black hover:bg-slate-200 transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </form>
  );
}