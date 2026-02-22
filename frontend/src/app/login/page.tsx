"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
//coockies



import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';


// 1. Definimos el esquema de validación
const loginSchema = z.object({
  email: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Inferimos el tipo de datos del esquema
type LoginFormValues = z.infer<typeof loginSchema>;



export default function LoginPymePage() {
const { user, setUser}= useUser()
 const searchParams = useSearchParams();
  const router = useRouter();

  const [userLogueado, setUserLogueado ] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  // 2. Configuramos el hook del formulario
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),// le pasamos el schema que creamos mas arriba
  });

    // Capturamos a dónde quería ir el usuario originalmente
  const destination = searchParams.get('from') || '/'; 

   // 3. Función para enviar a la API de Node.js
  const onSubmit = async (data: LoginFormValues) => {

    console.log("intento de loguearse desde el frontend....")

  try {

       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          // ESTO ES VITAL: Permite que el navegador reciba y guarde la cookie HttpOnly
          credentials: "include", 
        }); 

        const dataLogin = await res.json();
        console.log("data login ", res)
         if (res.ok) {
            setUser(dataLogin.user);
            console.log("user... desde login", dataLogin.user)
            // Elige un solo camino para el path
             const finalPath = destination !== '/' 
                ? destination 
                : `/admin/dashboard`;
            
            router.push(finalPath); 


           // router.push('/admin/dashboard')


          
        } 

    } catch (error) {
    console.error("Error en login:", error);
  }
};    


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      
      {/* LADO IZQUIERDO: FORMULARIO */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo y Encabezado */}
          <div className="space-y-2">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-sky-500 flex items-center justify-center shadow-md">
                <Heart className="w-4 h-4 text-white" fill="white" />
              </div>
              <span
                className="text-gray-900 tracking-tight"
                style={{
                  fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                }}
              >
                PYMECare
              </span>
            </Link>
            <h1
              className="text-gray-900"
              style={{
                fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                fontSize: "2rem",
                fontWeight: 600,
              }}
            >
              Bienvenido de nuevo
            </h1>
            <p className="text-gray-500" style={{ fontSize: "0.9rem" }}>
              Ingresá tus credenciales para acceder a la plataforma.
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-5"  
           onSubmit={(e) => {
              e.preventDefault(); // EVITA QUE LA PÁGINA SE RECARGUE
              handleSubmit(onSubmit)(e);
            }}
           >
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 ml-0.5">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-400 transition-colors" size={17} />
                <input 
                    {...register("email")}
                  type="email" 
                  placeholder="tu@email.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 
                  focus:ring-2 focus:ring-blue-50 transition-all
                   ${
                    errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""
                  }`}
                  
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}

                        
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-0.5">
                <label className="text-sm font-medium text-gray-700">
                  Contraseña
                </label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-400 transition-colors" size={17} />
                <input 
                {...register("password")} 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400
                   focus:ring-2 focus:ring-blue-50 transition-all
                          ${
                errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""
              }`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}


              
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button 
            disabled={isSubmitting}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-full font-medium flex items-center justify-center
             gap-2 transition-all shadow-lg shadow-gray-900/10 group cursor-pointer"
             style={{ fontSize: "0.9rem" }}
            >
              {isSubmitting ? "Cargando..." : "Ingresar"}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="space-y-2 text-center">
            <p className="text-gray-400" style={{ fontSize: "0.82rem" }}>
              ¿Sos cuidador?{' '}
              <Link href="/registro/cuidador" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Registrate acá
              </Link>
            </p>
            <p className="text-gray-400" style={{ fontSize: "0.82rem" }}>
              ¿Sos familiar?{' '}
              <Link href="/registro/familiar" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Registrate acá
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* LADO DERECHO: BRANDING / VISUAL */}
      <div className="hidden lg:flex bg-[#011627] relative overflow-hidden items-center justify-center p-12">
        {/* Decoración geométrica de fondo */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-15" />
        <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-sky-400 rounded-full blur-[140px] opacity-10" />
        
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full
           text-blue-400 text-sm font-medium backdrop-blur-md"
           style={{ fontSize: "0.82rem" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
            </span>
            Plataforma de Cuidados Domiciliarios
          </div>
          <h2
            className="text-white"
            style={{
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontSize: "2.5rem",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            Cuidado profesional para quienes más{' '}
            <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">importan.</span>
          </h2>
          <p className="text-gray-400" style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
            Gestioná acompañantes terapéuticos, turnos e informes desde un solo lugar. Tranquilidad para toda la familia.
          </p>
        </div>
      </div>
    </div>
  );
}