import { z } from "zod";

const signUpDetails = z.object({
  firstname: z
    .string()
    .min(2, { message: "Förnamnet måste vara minst 2 karaktärer" }),
  lastname: z
    .string()
    .min(2, { message: "Efternamnet måste vara minst 2 karaktärer" }),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Lösenordet måste vara minst 8 karaktärer" }),
  phone: z
    .string()
    .min(10, { message: "Telefonnumret måste vara minst 10 karaktärer" }),
  address: z
    .string()
    .min(5, { message: "Adressen måste vara minst 5 karaktärer" }),
  zipCode: z
    .string()
    .min(5, { message: "Postnumret måste vara minst 5 karaktärer" }),
  city: z
    .string()
    .min(2, { message: "Ortnamnet måste vara minst 2 karaktärer" }),
  country: z.string(),
  company: z.string().optional(),
});

type SignUpDetails = z.infer<typeof signUpDetails>;

const signInDetails = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Lösenordet måste vara minst 8 karaktärer" }),
});

type SignInDetails = z.infer<typeof signInDetails>;
