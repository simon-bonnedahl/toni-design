import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import client from "../../../sanity";
const passwordHash = require("password-hash");
export const authOptions = {
  // Configure one or more authentication providers

  providers: [
    CredentialsProvider({
      name: "credentials",

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
  ],
  callbacks: {
    async redirect(obj) {
      return "/";
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: "test",
};
export default NextAuth(authOptions);
