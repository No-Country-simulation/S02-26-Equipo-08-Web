"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMisDatos } from '@/src/actions/auth'; // Usamos tu función que sí funciona

interface UserData {
  id: string;
  nameUser: string;
  nameRole: string; // Agregamos nameRole para que no marque ROJO
  role: string; 
}

interface UserContextType {
  user: UserData | null;
  setUser: (user: UserData | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children, initialUser }: { children: ReactNode, initialUser: UserData | null }) {
  const [user, setUser] = useState<UserData | null>(initialUser);
  // Si tenemos initialUser, loading es false. Si no, empezamos cargando.
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    // Si ya tenemos el usuario del servidor (initialUser), no hacemos nada
    if (initialUser) {
      setLoading(false);
      return;
    }

    // Solo si no hay initialUser (ej: refresco de página manual), buscamos los datos
    const verifySession = async () => {
      try {
        const data = await getMisDatos(); // Usamos la Server Action en lugar del fetch al puerto 5000
        if (data) {
          setUser(data as any);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    verifySession();
  }, [initialUser]); 

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
} 

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    // Retorno seguro para evitar errores de undefined
    return { user: null, setUser: () => {}, loading: false }; 
  }
  return context;
}