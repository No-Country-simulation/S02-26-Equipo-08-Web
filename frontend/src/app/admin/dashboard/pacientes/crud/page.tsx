import { getPatientsAction } from "@/src/actions/pacientes";
import { DataTable } from "@/src/components/pacientes/DataTable";
import { UserPlus, Search, Edit3, Trash2, MapPin } from "lucide-react";

export default async function PatientsPage() {
  const { content: patients } = await getPatientsAction();

  console.log(" pacinets ", patients)

  return (
    <div className="space-y-8">
      {/* Header de la página */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-black text-brand-primary">
            PACIENTES
          </h1>
          <p className="text-slate-500 font-medium">Listado de altas y control de historias clínicas</p>
        </div>
        
        <button className="flex items-center gap-2 bg-brand-accent hover:bg-brand-accent-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 cursor-pointer">
          <UserPlus size={20} />
          REGISTRAR PACIENTE
        </button>
      </div>

      {/* Buscador Rápido */}
      <div className="relative max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Buscar por DNI o Nombre..." 
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all"
        />
      </div>
      {/* Footer / Stats */}
      <div className="bg-[var(--color-brand-secondary)] border border-slate-200 p-4 rounded-xl flex justify-between items-center">
        <span className="text-sm font-bold text-slate-500">
          TOTAL: {patients.length} PACIENTES ACTIVOS
        </span>
      </div>
      {/* Tabla */}
      <DataTable headers={["Paciente", "DNI", "Ubicación", "Historial", "Acciones"]}>
        {patients.map((patient) => (
          <tr key={patient.idPatient} className="hover:bg-slate-50 transition-colors group">
            <td className="px-6 py-4">
              <div className="flex flex-col">
                <span className="font-bold text-brand-primary">{patient.namePatient}</span>
                <span className="text-xs text-slate-400">{patient.agePatient} años</span>
              </div>
            </td>
            <td className="px-6 py-4 font-mono text-sm">{patient.dniPatient}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-1 text-sm text-slate-600">
                <MapPin size={14} className="text-brand-accent" />
                <span className="truncate max-w-[200px]">
                  {typeof patient.addressPatient === 'string' 
                    ? patient.addressPatient 
                    : `${patient.addressPatient?.calle} ${patient.addressPatient.numero}  `}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <p className="text-sm text-slate-500 line-clamp-1 italic">
                "{patient.medicalHistory}"
              </p>
            </td>
            <td className="px-6 py-4">
              <div className="flex justify-end gap-2">
                <button className="p-2 hover:bg-slate-200 rounded-lg text-[var(--color-brand-primary)] transition-colors">
                  <Edit3 size={18} />
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg text-[var(--color-brand-accent)] transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>


    </div>
  );
}