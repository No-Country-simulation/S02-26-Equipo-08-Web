"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  UserRound, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  X ,
  Activity
} from 'lucide-react';

import { logout } from '@/src/actions/auth';

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Pacientes (ABM)', href: '/admin/dashboard/pacientes', icon: UserRound },
  { name: 'Acompañantes', href: '/admin/dashboard/cuidadores', icon: Users }

];
 // { name: 'Informes/Horas', href: '/adm', icon: FileText },
  //{ name: 'Pagos', href: '#', icon: CreditCard },
  //{ name: 'Configuración', href: '#', icon: Settings },

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean, toggleSidebar: () => void }) {
  const pathname = usePathname();

const handleLogoutClick = async () => {
  await logout(); // Llama al Server Action
 // setUser(null);  // Limpia el estado global del UserContext
};

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
              <Activity className='ml-6  text-brand-accent' size={25}/>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden text-slate-400">
              <X size={24} />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
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
            <button
             onClick={handleLogoutClick}
              className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-brand-accent transition-colors">
              <LogOut size={20} />
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}