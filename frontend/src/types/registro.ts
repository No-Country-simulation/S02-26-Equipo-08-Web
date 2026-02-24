import { z } from "zod";

// esquema base compartido entre cuidador y familiar
const datosPersonalesSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "El nombre no puede superar los 60 caracteres"),
  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(60, "El apellido no puede superar los 60 caracteres"),
  identificacion: z
    .string()
    .min(7, "El DNI debe tener al menos 7 caracteres")
    .max(45, "El DNI no puede superar los 45 caracteres"),
  telefono: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .max(200, "El teléfono no puede superar los 200 caracteres"),
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(1000, "La dirección no puede superar los 1000 caracteres"),
  edad: z.coerce
    .number({ invalid_type_error: "La edad debe ser un número" })
    .int("La edad debe ser un número entero")
    .min(18, "Debés ser mayor de 18 años")
    .max(120, "Edad inválida") as z.ZodType<number>,
});

const datosBancariosSchema = z.object({
  cbu: z
    .string()
    .max(40, "El CBU no puede superar los 40 caracteres")
    .optional()
    .or(z.literal("")),
  cvu: z
    .string()
    .max(40, "El CVU no puede superar los 40 caracteres")
    .optional()
    .or(z.literal("")),
  alias: z
    .string()
    .max(40, "El alias no puede superar los 40 caracteres")
    .optional()
    .or(z.literal("")),
});

// esquema completo para registro de cuidador
export const registroCuidadorSchema = z
  .object({
    email: z
      .string()
      .email("Correo inválido")
      .max(60, "El email no puede superar los 60 caracteres"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmarPassword: z.string(),
    ...datosPersonalesSchema.shape,
    ...datosBancariosSchema.shape,
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

// esquema completo para registro de familiar
export const registroFamiliarSchema = z
  .object({
    email: z
      .string()
      .email("Correo inválido")
      .max(60, "El email no puede superar los 60 caracteres"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmarPassword: z.string(),
    ...datosPersonalesSchema.shape,
  })
  .refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
  });

// Nota: z.coerce.number() infiere el input como unknown en Zod v3,
// por eso sobreescribimos el tipo de edad manualmente para react-hook-form
export type RegistroCuidadorForm = Omit<z.infer<typeof registroCuidadorSchema>, "edad"> & { edad: number };
export type RegistroFamiliarForm = Omit<z.infer<typeof registroFamiliarSchema>, "edad"> & { edad: number };

// respuesta del backend
export interface RegistroResponse {
  success: boolean;
  data: { id: number; email: string } | null;
  message: string;
}
