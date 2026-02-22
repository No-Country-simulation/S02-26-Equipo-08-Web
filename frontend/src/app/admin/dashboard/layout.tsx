"use client";
import { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar'; // Verifica que la ruta a tu Sidebar sea correcta
import { Menu } from 'lucide-react';
import { useUser } from '@/src/context/UserContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Extraemos user y loading del contexto corregido
  const { user, loading } = useUser() as any;

  // 1. Si el contexto está cargando (verifySession en curso), mostramos el spinner
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-brand-secondary">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">
          Sincronizando sesión...
        </p>
      </div>
    );
  }

  // 2. Una vez que terminó de cargar, renderizamos el Dashboard
  return (
    <div className="min-h-screen bg-brand-secondary">
      {/* El Sidebar ahora recibirá los datos del contexto automáticamente */}
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />

      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* Navbar móvil (solo visible en pantallas pequeñas) */}
        <header className="lg:hidden bg-brand-primary text-white p-4 flex items-center justify-between">
          <span className="font-bold text-brand-accent">PYMECare</span>
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Contenido dinámico de las páginas del dashboard */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}