import { Plus, Search, MoreVertical, UserCircle2, Activity, LogOut } from 'lucide-react';
import { getMisDatos, logout } from "../../../actions/auth";
import { redirect } from "next/navigation";

// Obliga a Next.js a ejecutar la lógica del servidor en cada visita (evita el caché)
export const dynamic = 'force-dynamic';

export default async function PatientDashboard() {
  // 1. Validamos la sesión recuperando los datos del token
  const user = await getMisDatos();

  // 2. Si no hay usuario (token expirado o inexistente), redirigimos al login
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-brand-secondary p-8">
      
      {/* HEADER DINÁMICO */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Bienvenido, <span className="text-brand-accent">{user.nameUser}</span> 👋
          </h1>
          
          <p className="text-slate-500 font-medium">
            Panel de {user.role === 1 ? 'Administrador' : 'Cuidador'} | Gestión de Pacientes
          </p>
        </div>

        
        <div className="flex gap-3">
          
          <button className="flex items-center gap-2 bg-brand-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg cursor-pointer">
            <Plus size={20} className="text-brand-accent" />
            Nuevo Paciente
          </button>
        </div>
      </header>

      {/* MÉTRICAS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Pacientes Activos', value: '124', icon: <UserCircle2 className="text-brand-accent" /> },
          { label: 'Guardias Hoy', value: '42', icon: <Activity className="text-brand-accent" /> },
          { label: 'Pendientes de Pago', value: '$450k', icon: <div className="w-2 h-2 rounded-full bg-amber-500" /> }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{kpi.label}</p>
              <p className="text-3xl font-bold mt-1 text-brand-primary">{kpi.value}</p>
            </div>
            <div className="bg-brand-secondary p-3 rounded-lg">
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* BARRA DE FILTROS */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar paciente por nombre o ID..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
            />
          </div>
          <select className="px-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none text-brand-primary font-medium">
            <option>Todos los estados</option>
            <option>Activos</option>
            <option>Inactivos</option>
          </select>
        </div>

        {/* TABLA DE DATOS */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                <th className="px-6 py-4 font-semibold">Paciente</th>
                <th className="px-6 py-4 font-semibold">Cuidador Asignado</th>
                <th className="px-6 py-4 font-semibold">Última Guardia</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Mapeo de ejemplo (esto luego vendrá de tu fetch al puerto 8001) */}
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-brand-primary">Juan Pérez {i + 1}</td>
                  <td className="px-6 py-4 text-slate-600">Marta Gómez</td>
                  <td className="px-6 py-4 text-slate-500 text-sm">12 Oct, 2023</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-brand-accent transition-colors p-1 cursor-pointer">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINACIÓN */}
        <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
          <span>Mostrando 5 de 124 pacientes</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all cursor-pointer">
              Anterior
            </button>
            <button className="px-4 py-2 bg-brand-primary text-white rounded-lg transition-all hover:opacity-90 cursor-pointer">
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}