"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Mantenemos el estado local para el input
  const [text, setText] = useState(searchParams.get("search") || "");

  // Función que se dispara SOLO al presionar el botón o dar Enter
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Previene que la página se recargue
    
    const params = new URLSearchParams(searchParams.toString());
    
    if (text) {
      params.set("search", text);
    } else {
      params.delete("search");
    }
    
    // Al buscar, reiniciamos a la página 1
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <form 
      onSubmit={handleSearch} 
      className="relative flex-1 max-w-md flex gap-2"
    >
      <div className="relative flex-1">
        <Search 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
          size={18} 
        />
        <input 
          type="text" 
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Buscar por nombre, apellido o email..." 
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all text-slate-700 bg-white"
        />
      </div>
      
      <button 
        type="submit"
        className="bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md flex items-center gap-2"
      >
        <Search size={16} />
        Buscar
      </button>
    </form>
  );
}