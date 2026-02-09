// Dentro de tu Page.tsx
import { CaregiverTable } from "@/src/components/cuidadores/CaregiverTable";
import { getCaregiversAction} from '@/src/actions/cudadores'

export default async function CaregiversPage() {
  const { content: caregivers } = await getCaregiversAction();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-black text-brand-primary uppercase">Mantenimiento de Staff</h2>
      </div>
      
      {/* Renderizamos la tabla reutilizable */}
      <CaregiverTable 
        data={caregivers} 
        onEdit={(c) => console.log("Editando...", c)}
        onDelete={(id) => console.log("Borrando...", id)}
      />
    </div>
  );
}