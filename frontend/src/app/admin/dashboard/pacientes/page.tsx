import { getPatientsAction } from "@/src/actions/pacientes";
import { PatientCard } from "@/src/components/pacientes/PatientCard";
import { UserPlus, Search } from "lucide-react";
import Link from "next/link";

export default async function PatientsPage() {
  const { content: patients } = await getPatientsAction();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-5xl font-black text-[var(--color-brand-primary)] tracking-tighter">
            PACIENTES
          </h1>
          <p className="text-slate-500 font-medium mt-1">Gestión artesanal digitalizada</p>
        </div>
     <Link href="/admin/dashboard/pacientes/crud">
        <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-[var(--color-brand-accent)] hover:bg-[var(--color-brand-accent-hover)] text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-red-500/20 active:scale-95">
          <UserPlus size={22} />
          MATENIMIENTO PACIENTE
        </button>
      </Link>  
      </div>

      {/* Buscador Estilizado */}
      <div className="relative group max-w-2xl mx-auto md:mx-0">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--color-brand-accent)] transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Buscar paciente por nombre, DNI o historial..." 
          className="w-full pl-14 pr-6 py-5 rounded-3xl border-2 border-slate-100 bg-white focus:outline-none focus:border-[var(--color-brand-accent)] shadow-sm transition-all text-lg"
        />
      </div>

      {/* Grid de Cards */}
   {/*    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <PatientCard key={patient.idPatient} patient={patient} />
        ))}
      </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start"> 
            {/* El items-start evita que todas las tarjetas de la misma fila crezcan juntas */}
            {patients.map((patient) => (
                <PatientCard key={patient.idPatient} patient={patient} />
            ))}
        </div>

      {/* Empty State (por si no hay datos) */}
      {patients.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">No se encontraron pacientes registrados.</p>
        </div>
      )}
    </div>
  );
}