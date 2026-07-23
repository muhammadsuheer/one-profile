import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
})

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
