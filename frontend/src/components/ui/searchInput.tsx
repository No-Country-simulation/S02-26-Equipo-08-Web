"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Sincroniza el estado inicial con la URL si ya hay una búsqueda
  const [text, setText] = useState(searchParams.get("search") || "");

  useEffect(() => {
    // Debounce: Espera 400ms para no saturar el servidor con cada tecla
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (text) {
        params.set("search", text);
      } else {
        params.delete("search");
      }
      
      // Al buscar, reiniciamos a la página 1
      params.set("page", "1");

      router.push(`${pathname}?${params.toString()}`);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [text, pathname, router, searchParams]);

  return (
    <div className="relative flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input 
        type="text" 
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Buscar por nombre, apellido o email..." 
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/20 transition-all text-slate-700 bg-white"
      />
    </div>
  );
}