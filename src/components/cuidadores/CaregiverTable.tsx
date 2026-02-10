"use client";
import { Edit2, Trash2, ExternalLink, Phone, IdCard, Search, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Caregiver } from "@/src/types/caregiver";

interface CaregiverTableProps {
  data: Caregiver[];
/*   onEdit: (caregiver: Caregiver) => void;
  onDelete: (id: boolean) => void; */
}

export function CaregiverTable({ data}: CaregiverTableProps) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        
      
      {/* TOOLBAR DE LA TABLA */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-secondary/20">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Filtrar por nombre o DNI..." 
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 focus:border-brand-primary outline-none transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 text-xs font-bold text-slate-400">
          Mostrando <span className="text-brand-primary">{data.length}</span> cuidadores activos
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-primary text-brand-secondary">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Cuidador</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Identificación</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Contacto</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Pagos (Alias)</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-brand-secondary/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-brand-primary font-bold">
                      {item.firstName[0]}{item.lastName[0]}
                    </div>
                    <div>
                      <p className="font-black text-brand-primary text-sm uppercase leading-none">
                        {item.firstName} {item.lastName}
                      </p>
                      <span className="text-[10px] text-slate-400 font-medium">ID Usuario: {item.userId}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <IdCard size={14} className="text-brand-accent" />
                    {item.dni}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <Phone size={14} className="text-brand-accent" />
                    {item.phone}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {item.cvu_alias ? (
                    <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100">
                      {item.cvu_alias}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300 italic">No registrado</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => onEdit(item)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-brand-primary hover:border-brand-primary transition-all shadow-sm group-hover:bg-brand-primary group-hover:text-white"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-brand-accent hover:border-brand-accent transition-all shadow-sm"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINACIÓN */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
        <button className="text-xs font-black text-slate-400 hover:text-brand-primary transition-colors uppercase tracking-widest">
          ← Anterior
        </button>
        <div className="flex gap-1">
          {[1, 2, 3].map(n => (
            <button key={n} className={`w-8 h-8 rounded-lg text-xs font-bold ${n === 1 ? 'bg-brand-primary text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
              {n}
            </button>
          ))}
        </div>
        <button className="text-xs font-black text-slate-400 hover:text-brand-primary transition-colors uppercase tracking-widest">
          Siguiente →
        </button>
      </div>
    </div>
  );
}