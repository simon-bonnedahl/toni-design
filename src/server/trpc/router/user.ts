/* eslint @typescript-eslint/no-var-requires: "off" */
import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import bcrypt from "bcryptjs";
import sanityDB from "../../../../sanity";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export const userRouter = router({
  signUp: publicProcedure
    .input(
      z.object({
        email: z.string().email({ message: "Ogiltigt epostadress" }),
        password: z
          .string()
          .min(8, { message: "Lösenordet måste vara minst 8 karaktärer" }),
        firstname: z
          .string()
          .min(2, { message: "Måste vara minst 2 karaktärer" }),
        lastname: z
          .string()
          .min(2, { message: "Måste vara minst 2 karaktärer" }),
        phone: z.string().min(10, { message: "Ogiltigt telefonnummer" }),
        address: z.string().min(2, { message: "Ogiltig adress" }),
        zipCode: z.string().min(5, { message: "Ogiltigt postnummer" }),
        city: z.string().min(2, { message: "Ogiltig stad" }),
        country: z.string().min(2, { message: "Ogiltigt land" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      //Check if email is already in use from prisma
      const emailInUse = await prisma.account.findUnique({
        where: {
          email: input.email,
        },
      });
      if (emailInUse) {
        throw new Error("Epostadressen är redan registrerad");
      }

      const saltedPassword = await bcrypt.hash(input.password, 10);
      if (input.email == "admin@admin.com") {
        await prisma.account.create({
          data: {
            email: input.email,
            password: saltedPassword,
            role: "admin",
          },
        });
        return;
      }
      //Create account with prisma
      await prisma.account.create({
        data: {
          email: input.email,
          password: saltedPassword,
          firstname: input.firstname,
          lastname: input.lastname,
          phone: input.phone,
          address: input.address,
          zipcode: input.zipCode,
          city: input.city,
          country: input.country,
        },
      });

      /*const account1 = {
        _type: "account",
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        password: saltedPassword,
        phone: input.phone,
        address: input.address,
        zipCode: input.zipCode,
        city: input.city,
        country: input.country,
        role: "customer",
      };
      sanityDB.create(account1).then(() => {
        console.log("Account created", account1);
      });*/
    }),
  getUserDetails: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const query = `*[_type == "account" && email == '${input.email}'][0]`;
      const result = await sanityDB.fetch(query);
      if (!result) {
        throw new Error("Användaren finns inte");
      }

      return { ...result, password: "" };
    }),
  updateUserDetails: publicProcedure
    .input(
      z.object({
        email: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        phone: z.string(),
        address: z.string(),
        zipCode: z.string(),
        city: z.string(),
        country: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const query = `*[_type == "account" && email == '${input.email}'][0]`;
      const result = await sanityDB.fetch(query);
      if (!result) {
        throw new Error("Användaren finns inte");
      }
      const account = {
        _id: result._id,
        _type: "account",
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        phone: input.phone,
        address: input.address,
        zipCode: input.zipCode,
        city: input.city,
        country: input.country,
      };
      sanityDB.create(account).then(() => {
        console.log("Account updated", account);
      });
    }),
  getOrders: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const query = `*[_type == "order" && email == '${input.email}']`;
      const result = await sanityDB.fetch(query);
      return result;
    }),
});
