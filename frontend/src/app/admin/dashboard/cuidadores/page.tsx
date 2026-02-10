import { getCaregiversAction } from "@/src/actions/cudadores";
import { CaregiverCard } from "@/src/components/cuidadores/CaregirversCard";
import { UserPlus, Search } from "lucide-react";

import Link from "next/link";

export default async function CaregiversPage() {
    const { content: caregivers } = await getCaregiversAction();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Estilizado */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-5xl font-black text-brand-primary tracking-tighter">CUIDADORES</h1>
                    <p className="text-slate-500 font-medium">Gestión de staff y documentación legal</p>
                </div>
                <Link href={`/admin/dashboard/cuidadores/crud`}>
                    <button className="bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-red-500/10 active:scale-95 flex items-center gap-3">
                        <UserPlus size={20} /> ALTA CUIDADOR
                    </button>
                </Link>
            </div>



            {/* Buscador */}
            <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, DNI o teléfono..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-brand-accent outline-none transition-all shadow-sm"
                />
            </div>

            {/* Grid con items-start para evitar que se estiren las cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {caregivers.map((caregiver) => (
                    <CaregiverCard key={caregiver.id} caregiver={caregiver} />
                ))}
            </div>
        </div >
    );
}