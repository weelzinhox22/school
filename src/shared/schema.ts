import { z } from "zod";

// Login schema for validation
export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  role: z.enum(["professor", "coordenador", "diretor"], {
    required_error: "Selecione um perfil de acesso",
  }),
  remember: z.boolean().optional(),
});

export type LoginCredentials = z.infer<typeof loginSchema>; 