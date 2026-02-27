"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserRound,
  Settings,
  LogOut,
  X,
  Activity,
  User,
  FileCheck,
  Heart,
  CalendarClock
} from 'lucide-react';

// Importamos tus funciones de auth
import { getMisDatos, logout } from '@/src/actions/auth';

// Menú con propiedad 'roles' para filtrado — Rol 1: Admin, Rol 2: Cuidador, Rol 3: Familiar
const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard, roles: [1, 2, 3] },
  { name: 'Pacientes (ABM)', href: '/admin/dashboard/pacientes', icon: UserRound, roles: [1] },
  { name: 'Acompañantes', href: '/admin/dashboard/cuidadores', icon: Users, roles: [1] },
  { name: 'Usuarios', href: '/admin/dashboard/usuarios', icon: Settings, roles: [1] },
  { name: 'Mi Documentación', href: '/admin/dashboard/documentacion', icon: FileCheck, roles: [2, 3] },
  { name: 'Mis Familiares', href: '/admin/dashboard/pacientes', icon: Heart, roles: [3] },
  { name: 'Mis Solicitudes', href: '/admin/dashboard/solicitudes', icon: CalendarClock, roles: [3] },
];

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // Carga de datos del usuario
  useEffect(() => {
    const cargarInformacion = async () => {
      try {
        const datos = await getMisDatos();
        if (datos) {
          setUser(datos);
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };
    cargarInformacion();
  }, []);

  const handleLogoutClick = async () => {
    await logout();
  };

  // --- FILTRADO POR ROL Y ESTADO ---
  const filteredMenuItems = menuItems.filter(item => {
    // 1. Si los datos aún no cargan, solo mostramos Dashboard por seguridad
    if (!user) return item.name === 'Dashboard';

    // 2. Validación de Cuidadores NO habilitados (id_rol 2 y estado distinto de 2)
    if (user.role === 2 && user.id_usuario_estado !== 2) {
      return item.name === 'Dashboard';
    }

    // 3. Filtrado normal por rol para usuarios habilitados
    return item.roles.includes(user.role);
  });
  
  return (
    <>
      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64
        bg-brand-primary text-white
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center font-bold">
                P
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-secondy">
                PYME<span className="text-brand-accent">Care</span>
              </span>
              <Activity className='ml-6 text-brand-accent' size={25}/>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          {/* Navegación Filtrada */}
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {filteredMenuItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive
                      ? 'bg-brand-accent text-white shadow-lg shadow-red-900/20'
                      : 'hover:bg-white/10 text-slate-400 hover:text-white'}
                  `}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-brand-accent'} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Sidebar (User info) */}
          <div className="p-4 border-t border-white/10">
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 text-slate-400 mb-2">
                <div className="bg-white/5 p-2 rounded-lg">
                  <User size={18} className="text-brand-accent" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent truncate">
                    {user.nameRole || 'Usuario'}
                  </span>
                  <span className="text-xs text-slate-300 truncate font-medium">
                    {user.nameUser}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-brand-accent transition-colors group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}