import NextAuth, { type NextAuthOptions } from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import sanityDB from "../../../../sanity";
import { PrismaClient } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  jwt: {
    secret: "secret",
    maxAge: 3000,
  },
  session: {
    strategy: "jwt",
    maxAge: 3000,
  },
  secret: "secret",
  // Include user.id on session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.account) {
        session.account = {
          id: session.account.id,
          firstname: session.account.firstname,
          email: session.account.email,
          role: session.account.role,
        };
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        //check if user exists with prisma
        const prisma = new PrismaClient();
        const account = await prisma.account.findUnique({
          where: {
            email: credentials?.email,
          },
        });
        if (!account) {
          throw new Error("Användaren finns inte");
        } else {
          const isValid = bcrypt.compareSync(
            credentials?.password as string,
            account.password as string
          );
          if (isValid) {
            return {
              firstname: account.firstname,
              email: account.email,
              id: account.id,
              role: account.role,
            };
          } else {
            throw new Error("Fel lösenord");
          }
          // You can also Reject this callback with an Error or with a URL:
          // throw new Error('error message') // Redirect to error page
          // throw '/path/to/redirect'        // Redirect to a URL
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
};

export default NextAuth(authOptions);
