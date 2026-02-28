"use client";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginAction } from '@/src/actions/auth';



import { Mail, Lock, Eye, EyeOff, ArrowRight, Heart, ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email("Correo inválido").min(1, "El correo es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPymePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [bloqueado, setBloqueado] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setBloqueado(null);
    const formData = new FormData();
    formData.set('email', data.email);
    formData.set('password', data.password);

    const result = await loginAction(formData);
    if (result?.error) {
      if (result.errorCode === "USUARIO_NO_HABILITADO") {
        setBloqueado(result.error);
      } else {
        setServerError(result.error);
      }
    }
    // Si no hay error, loginAction hace redirect() al dashboard automáticamente
  };

  // Pantalla de usuario no habilitado
  if (bloqueado) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100 text-center max-w-lg w-full">
          <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Usuario no habilitado
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed mb-6">
            {bloqueado}
          </p>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">
              Acción requerida
            </p>
            <p className="text-gray-900 font-bold text-lg">
              Por favor comuníquese con el administrador para habilitar su usuario.
            </p>
          </div>
          <button
            onClick={() => setBloqueado(null)}
            className="flex items-center gap-2 mx-auto text-sm text-slate-500 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <ArrowLeft size={15} />
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
      
      {/* LADO IZQUIERDO: FORMULARIO */}
      <div className="flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md space-y-8">
          
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

          {/* MENSAJE DE ERROR DEL SERVIDOR */}
          {serverError && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-2xl text-sm font-bold">
              {serverError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
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
               <Link 
                href="/identity/account/forgot-password" 
                className="text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
              </Link>
            </p>
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