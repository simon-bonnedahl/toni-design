import { User } from "@prisma/client";
import { z } from "zod";

enum AUTH {
  SIGN_IN = "SIGN_IN",
  SIGN_UP = "SIGN_UP",
}

export const UserLogin = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { msg: "Lösenordet måste vara minst 6 karaktärer" }),
});

type UserLogin = z.infer<typeof UserLogin>;

export interface TRPCError {
  validation: string;
  code: string;
  message: string;
  path: string[];
  minimum?: number;
  type: string;
  inclusive?: boolean;
}
