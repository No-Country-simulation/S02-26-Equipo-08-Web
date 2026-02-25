import { 
  Plus, Search, MoreVertical, UserCircle2, Activity, 
  Users, Calendar, ClipboardList, Heart, ShieldCheck 
} from 'lucide-react';
import { redirect } from "next/navigation"; // Importación vital para Next.js
import { getMisDatos } from "../../../actions/auth";
import { getDashboardData } from "../../../actions/dashboard";

// Forzamos que la página se genere en el servidor siempre para tener datos frescos
export const dynamic = 'force-dynamic';

export default async function PatientDashboard() {
  // 1. Validamos la sesión del usuario
  const user = await getMisDatos();

  // Redirección fuera de cualquier bloque try/catch para evitar errores de Next.js
  if (!user) {
    redirect("/login");
  }

  // 2. Obtenemos los datos dinámicos del Backend (Puerto 8001)
  const dashboardData = await getDashboardData();

  // Definición de Roles basada en tu base de datos
  const isAdmin = user.role === 1;
  const isCuidador = user.role === 2;
  const isFamiliar = user.role === 3;

  // Si la API falla o no devuelve datos, mostramos un estado de error amigable
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-secondary">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <p className="text-red-500 font-bold text-lg">Error de conexión</p>
          <p className="text-slate-500">No se pudo obtener la información del servidor. Revisa que el backend esté corriendo.</p>
        </div>
      </div>
    );
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
            Panel de {isAdmin ? 'Administrador' : isCuidador ? 'Cuidador' : 'Familiar'} | Gestión PYMECare
          </p>
        </div>

        <div className="flex gap-3">
          {isAdmin && (
            <button className="flex items-center gap-2 bg-brand-primary hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg cursor-pointer">
              <Plus size={20} className="text-brand-accent" />
              Nuevo Usuario
            </button>
          )}
          {isFamiliar && (
            <button className="flex items-center gap-2 bg-brand-accent text-brand-primary hover:opacity-90 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg cursor-pointer">
              <Plus size={20} />
              Solicitar Servicio
            </button>
          )}
        </div>
      </header>

      {/* MÉTRICAS (KPIs) DINÁMICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardData.kpis?.map((kpi: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{kpi.label}</p>
              <p className="text-3xl font-bold mt-1 text-brand-primary">{kpi.value}</p>
            </div>
            <div className="bg-brand-secondary p-3 rounded-lg text-brand-accent">
              {/* Icono genérico o podrías mapearlo según kpi.label */}
              <Activity size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE TABLA / DATOS */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* BARRA DE FILTROS */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar en los registros..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all"
            />
          </div>
        </div>

        {/* TABLA DE DATOS DINÁMICA */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                <th className="px-6 py-4 font-semibold">
                  {isAdmin ? 'Usuario' : 'Detalle del Servicio / Paciente'}
                </th>
                <th className="px-6 py-4 font-semibold">
                  {isAdmin ? 'Rol' : 'Información Adicional'}
                </th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardData.listado?.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-brand-primary">
                    {isAdmin 
                      ? (item.nameUser || item.nombre) 
                      : (
                          item.paciente 
                            ? `${item.paciente.nombre} ${item.paciente.apellido || ''}` 
                            : "Paciente General"
                        )
                    }
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {isAdmin ? 'Personal Staff' : (item.tipo_servicio || 'Cuidado Domiciliario')}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '---'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {item.estado || 'Activo'}
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

          {/* Estado vacío */}
          {(!dashboardData.listado || dashboardData.listado.length === 0) && (
            <div className="p-12 text-center text-slate-400">
              No se encontraron registros para mostrar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}