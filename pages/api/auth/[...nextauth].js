import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import client from "../../../sanity";
const passwordHash = require("password-hash");

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "toni-design",
      credentials: {
        email: {
          label: "email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        let query = `*[_type == "account" && email == $email][0]`;
        let params = { email: credentials.email };
        let account = await client.fetch(query, params);
        if (account) {
          if (passwordHash.verify(credentials.password, account.password)) {
            return { email: account.email, name: account.firstname };
          }
        }
        return null;
      },
    }),
    // ...add more providers here
  ],

  secret: process.env.NEXT_PUBLIC_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.token,
          refreshToken: user.refreshToken,
        };
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
      session.user.accessTokenExpires = token.accessTokenExpires;

      return session;
    },
  },
});
