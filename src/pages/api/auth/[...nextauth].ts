import NextAuth, { type NextAuthOptions } from "next-auth";

// Prisma adapter for NextAuth, optional and can be removed
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import sanityDB from "../../../../sanity";

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
      if (token && session.user) {
        session.user = {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
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
        //check if user exists with sanity
        const query = `*[_type == "account" && email == '${credentials?.email}'][0]`;
        const account = await sanityDB.fetch(query);
        if (!account) {
          throw new Error("Användaren finns inte");
        } else {
          const isValid = bcrypt.compareSync(
            credentials?.password as string,
            account.password as string
          );
          if (isValid) {
            return {
              name: account.firstname,
              email: account.email,
              id: account._id,
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
