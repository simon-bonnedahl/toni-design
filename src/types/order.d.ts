import { z } from "zod";

const CustomerDetailsZod = z.object({
  firstname: z
    .string()
    .min(2, { message: "Förnamnet måste vara minst 2 karaktärer" }),
  lastname: z
    .string()
    .min(2, { message: "Efternamnet måste vara minst 2 karaktärer" }),
  email: z.string().email(),
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

type CustomerDetails = z.infer<typeof CustomerDetailsZod>;

const OrderDetailsZod = z.object({
  paymentMethod: z.string(),
  deliveryMethod: z.string(),
  total: z.number(),
});

type OrderDetails = z.infer<typeof OrderDetailsZod>;

export { CustomerDetails, OrderDetails, CustomerDetailsZod, OrderDetailsZod };
