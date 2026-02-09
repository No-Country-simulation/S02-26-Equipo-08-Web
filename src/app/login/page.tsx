"use client";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
//coockies



import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-brand-secondary">
      
      {/* LADO IZQUIERDO: FORMULARIO */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
          {/* Logo y Encabezado */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-primary flex items-center justify-center rounded-xl shadow-lg">
                <ShieldCheck className="text-brand-accent" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter text-brand-primary">
                PYME<span className="text-brand-accent">Care</span>
              </span>
            </div>
            <h1 className="text-4xl font-bold text-brand-primary tracking-tight">
              Bienvenido de nuevo
            </h1>
            <p className="text-slate-500 font-medium">
              Ingresa tus credenciales para gestionar pacientes y cuidadores.
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-5"  
           onSubmit={(e) => {
              e.preventDefault(); // EVITA QUE LA PÁGINA SE RECARGUE
              handleSubmit(onSubmit)(e);
            }}
           >
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-primar] uppercase tracking-wider ml-1">
                Email Corporativo
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={20} />
                <input 
                    {...register("email")}
                  type="email" 
                  placeholder="ejemplo@pymecare.com"
                  className={`w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-brand-accent 
                  focus:ring-4 focus:ring-red-50 transition-all text-brand-primar] font-medium
                  
                   ${
                    errors.email ? "border-red-500 ring-1 ring-red-500" : "border-brand-gray focus:ring-2 focus:ring-brand-gold"
                  }`}
                  
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}

                        
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-brand-primary uppercase tracking-wider">
                  Contraseña
                </label>
                <a href="#" className="text-xs font-bold text-brand-accent hover:underline">¿Olvidaste tu contraseña?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-accent transition-colors" size={20} />
                <input 
                {...register("password")} 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-brand-accent
                   focus:ring-4 focus:ring-red-50 transition-all text-brand-primary font-medium 
                          ${
                errors.password ? "border-red-500 ring-1 ring-red-500" : "border-brand-gray focus:ring-2 focus:ring-brand-gold"
              }`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}


              
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button 
            disabled={isSubmitting}
            className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-4 rounded-2xl font-bold flex items-center justify-center
             gap-2 transition-all active:scale-[0.98] shadow-xl group cursor-pointer">
              {isSubmitting ? "Cargando..." : "Ingresar"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-brand-accent" />
            </button>
          </form>

          <p className="text-center text-slate-500 font-medium">
            ¿Eres un nuevo cuidador?{' '}
            <Link href="/register" className="text-brand-accent font-bold hover:underline">
              Postúlate aquí
            </Link>
          </p>
        </div>
      </div>

      {/* LADO DERECHO: BRANDING / VISUAL */}
      <div className="hidden lg:flex bg-brand-primary relative overflow-hidden items-center justify-center p-12">
        {/* Decoración geométrica de fondo */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-accent rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-brand-accent rounded-full blur-[120px] opacity-20" />
        
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full
           text-brand-accent text-sm font-bold backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            Sistema de Gestión v4.0
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            Digitalizando el cuidado <span className="text-brand-accent">artesanal.</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            Olvídate de los grupos de WhatsApp y las plantillas de Excel. Centraliza informes, pagos y métricas en un solo lugar.
          </p>
        </div>
      </div>
    </div>
  );
}