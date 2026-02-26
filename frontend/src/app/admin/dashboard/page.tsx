import { 
  Plus, Search, MoreVertical, Activity, 
  User
} from 'lucide-react';
import { redirect } from "next/navigation";
import Link from "next/link"; 
import { getMisDatos } from "../../../actions/auth";
import { getDashboardData } from "../../../actions/dashboard";
import SearchInput from "../../../components/ui/searchInput";

export const dynamic = 'force-dynamic';

// Definición de Props corregida para Next.js 15
interface Props {
  searchParams: Promise<{ 
    page?: string; 
    search?: string; 
  }>;
}

export default async function PatientDashboard({ searchParams }: Props) {
  // 1. Obtenemos los parámetros de búsqueda y página
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const searchTerm = params.search || "";

  // 2. Validamos la sesión del usuario
  const user = await getMisDatos();
  if (!user) {
    redirect("/login");
  }

  // 3. Obtenemos los datos filtrados (Pasamos página Y término de búsqueda)
  const dashboardData = await getDashboardData(currentPage, searchTerm);

  const isAdmin = user.role === 1;
  const isCuidador = user.role === 2;
  const isFamiliar = user.role === 3;

  const ESTADOS: Record<string, { label: string; color: string }> = {
    "Activo": { label: "Activo", color: "bg-emerald-100 text-emerald-700" },
    "Pendiente de Aceptar": { label: "Pendiente", color: "bg-amber-100 text-amber-700" },
    "Rechazado": { label: "Rechazado", color: "bg-red-100 text-red-700" },
    "Desactivado": { label: "Desactivado", color: "bg-slate-100 text-slate-600" },
  };

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-secondary">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
          <p className="text-red-500 font-bold text-lg">Error de conexión</p>
          <p className="text-slate-500">No se pudo obtener la información del servidor.</p>
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

      {/* MÉTRICAS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {dashboardData.kpis?.map((kpi: any, i: number) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">{kpi.label}</p>
              <p className="text-3xl font-bold mt-1 text-brand-primary">{kpi.value}</p>
            </div>
            <div className="bg-brand-secondary p-3 rounded-lg text-brand-accent">
              <Activity size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
            <SearchInput /> 
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                <th className="px-6 py-4 font-semibold">{isAdmin ? 'Usuario' : 'Detalle del Servicio / Paciente'}</th>
                <th className="px-6 py-4 font-semibold">{isAdmin ? 'Rol' : 'Información Adicional'}</th>
                <th className="px-6 py-4 font-semibold">{isAdmin ? 'Fecha alta' : 'Fecha'}</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dashboardData.listado?.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-medium text-brand-primary">
                    {isAdmin 
                      ? (`${item.apellido} ${item.nombre || ''}`) 
                      : (item.paciente 
                          ? `${item.paciente.nombre} ${item.paciente.apellido || ''}` 
                          : (item.nombre ? `${item.nombre} ${item.apellido || ''}` : "Paciente General")
                        )
                    }
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {isAdmin ? item.rol : (item.informacion_adicional || item.tipo_servicio)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {(item.fecha || item.fecha_del_servicio || item.createdAt) 
                      ? new Date(item.fecha || item.fecha_del_servicio || item.createdAt).toLocaleDateString() 
                      : '---'}
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const estadoInfo = ESTADOS[item.estado] || { 
                        label: item.estado || "Desconocido", 
                        color: "bg-slate-100 text-slate-600" 
                      };
                      return (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${estadoInfo.color}`}>
                          {estadoInfo.label}
                        </span>
                      );
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!dashboardData.listado || dashboardData.listado.length === 0) && (
            <div className="p-12 text-center text-slate-400">No se encontraron registros.</div>
          )}
        </div>

        {/* PAGINACIÓN */}
        {dashboardData.pagination && dashboardData.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Página <span className="font-bold text-brand-primary">{currentPage}</span> de {dashboardData.pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <Link
                href={`?page=${currentPage - 1}&search=${searchTerm}`}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  currentPage <= 1 ? 'pointer-events-none opacity-50 bg-slate-100' : 'bg-white hover:bg-slate-50'
                }`}
              >
                Anterior
              </Link>
              <Link
                href={`?page=${currentPage + 1}&search=${searchTerm}`}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  currentPage >= dashboardData.pagination.totalPages ? 'pointer-events-none opacity-50 bg-slate-100' : 'bg-white hover:bg-slate-50'
                }`}
              >
                Siguiente
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}