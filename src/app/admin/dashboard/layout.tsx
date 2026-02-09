"use client";
import { useState } from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import { Menu } from 'lucide-react';
import { useUser } from '@/src/context/UserContext';
import { notFound } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user }= useUser();
  

  if(user?.role !== 'ADMIN'){
    console.log(" ud no es aministrador....", user);
   // notFound()
  }

  return (
    <div className="min-h-screen  bg-brand-secondary">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Contenido Principal */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* Navbar móvil */}
        <header className="lg:hidden bg-brand-primary text-red-700 p-4 flex items-center justify-between">
          <span className="font-bold">PYMECare</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2">
            <Menu size={24} />
          </button>
        </header>

        {/* Vista de Página */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}