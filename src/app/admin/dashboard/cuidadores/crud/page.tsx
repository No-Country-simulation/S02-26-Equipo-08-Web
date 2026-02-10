// Dentro de tu Page.tsx
import { CaregiverTable } from "@/src/components/cuidadores/CaregiverTable";
import { getCaregiversAction} from '@/src/actions/cudadores'
import { UserPlus } from 'lucide-react'
import Link from "next/link";

export default async function CaregiversPage() {
  const { content: caregivers } = await getCaregiversAction();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-black text-brand-primary uppercase">Mantenimiento de Staff</h2>
      </div>
      
      {/* Renderizamos la tabla reutilizable */}
        <Link href={`/admin/dashboard/cuidadores/crud/save`}>
                    <button className="bg-brand-accent hover:bg-brand-accent-hover text-white px-8 py-4 rounded-2xl font-black transition-all shadow-xl shadow-red-500/10 active:scale-95 flex items-center gap-3">
                        <UserPlus size={20} /> Agregar Cuidador
                    </button>
                </Link>
      <CaregiverTable 
        data={caregivers} 
        /*  onEdit={(c) => console.log("Editando...", c)}
        onDelete={(id) => console.log("Borrando...", id)}  */
      />
    </div>
  );
}