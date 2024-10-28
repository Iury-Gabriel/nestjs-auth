import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export interface UserData {
    name: string;
    email: string;
    password: string;
}

export interface PublicUserData {
    name: string;
    email: string;
}