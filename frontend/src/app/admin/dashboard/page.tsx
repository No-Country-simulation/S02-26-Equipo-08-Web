import {
  User, ShieldCheck, Stethoscope, Heart, ShieldAlert,
  Briefcase, FileCheck, DollarSign, CalendarClock, ClipboardList, Settings
} from 'lucide-react';
import { redirect } from "next/navigation";
import Link from "next/link";
import { getMisDatos } from "../../../actions/auth";

export const dynamic = 'force-dynamic';

export default async function PatientDashboard() {
  const user = await getMisDatos();
  if (!user) {
    redirect("/login");
  }

  const perfilNombre =
    user.role === 1 ? 'administrador' :
    user.role === 2 ? 'cuidador' :
    'familiar';

  const isEnabled = user.estadoUsuario === 2;

  if (!isEnabled) {
    return (
      <div className="min-h-screen bg-brand-secondary p-8 flex items-center justify-center">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100 text-center max-w-lg animate-in fade-in zoom-in duration-300">
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-brand-primary mb-4">
            Usuario no habilitado
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            Lo sentimos, <span className="font-bold text-brand-primary">{user.nameUser}</span>.
            Actualmente tu perfil de {perfilNombre} no se encuentra activo en el sistema.
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
              Acción requerida
            </p>
            <p className="text-brand-primary font-bold text-lg">
              Por favor comuníquese con el administrador para habilitar su usuario.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const icons: Record<number, React.ReactNode> = {
    1: <ShieldCheck size={40} className="text-brand-accent" />,
    2: <Stethoscope size={40} className="text-brand-accent" />,
    3: <Heart size={40} className="text-brand-accent" />
  };

  const isAdmin = user.role === 1;
  const isCuidador = user.role === 2;

  const modulos = [
    { name: 'Usuarios', href: '/admin/dashboard/usuarios', icon: Settings, descripcion: 'Gestión de usuarios', roles: [1] },
    { name: 'Solicitudes', href: '/admin/dashboard/solicitudes', icon: ClipboardList, descripcion: 'Solicitudes de servicio', roles: [1] },
    { name: 'Honorarios', href: '/admin/dashboard/honorarios', icon: DollarSign, descripcion: 'Gestión de honorarios', roles: [1] },
    { name: 'Mis Asignaciones', href: '/admin/dashboard/solicitudes', icon: Briefcase, descripcion: 'Servicios asignados', roles: [2] },
    { name: 'Mi Documentación', href: '/admin/dashboard/documentacion', icon: FileCheck, descripcion: 'Gestión de documentos', roles: [2, 3] },
    { name: 'Mis Honorarios', href: '/admin/dashboard/honorarios', icon: DollarSign, descripcion: 'Mis pagos y honorarios', roles: [2] },
    { name: 'Mis Solicitudes', href: '/admin/dashboard/solicitudes', icon: CalendarClock, descripcion: 'Solicitar servicio', roles: [3] },
    { name: 'Mis Familiares', href: '/admin/dashboard/pacientes', icon: Heart, descripcion: 'Pacientes a cargo', roles: [3] },
  ].filter(m => m.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-brand-secondary p-8">

      {/* HEADER */}
      <header className="flex items-center gap-4 mb-10">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
          {icons[user.role as keyof typeof icons] || <User size={40} className="text-brand-accent" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-brand-primary">
            Bienvenido, <span className="text-brand-accent">{user.nameUser}</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Panel de {isAdmin ? 'Administrador' : isCuidador ? 'Cuidador' : 'Familiar'} | Gestión PYMECare
          </p>
        </div>
      </header>

      {/* ACCESO RÁPIDO */}
      <h2 className="text-lg font-bold text-brand-primary mb-4 uppercase tracking-wider">Acceso rápido</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modulos.map((modulo) => {
          const Icon = modulo.icon;
          return (
            <Link
              key={modulo.name}
              href={modulo.href}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:border-brand-accent hover:shadow-md transition-all group"
            >
              <div className="bg-brand-secondary p-3 rounded-xl group-hover:bg-brand-accent/10 transition-colors">
                <Icon size={28} className="text-brand-accent" />
              </div>
              <div>
                <p className="font-bold text-brand-primary text-base">{modulo.name}</p>
                <p className="text-sm text-slate-500">{modulo.descripcion}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
