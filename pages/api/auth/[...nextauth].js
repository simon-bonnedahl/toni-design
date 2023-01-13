import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import client from "../../../sanity";
const passwordHash = require("password-hash");

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",

      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        let query = `*[_type == "account" && email == $email][0]`;
        let params = { email: credentials.email };
        let account = await client.fetch(query, params);

        if (passwordHash.verify(credentials.password, account.password))
          return { email: account.email, name: account.firstname };
        return null;
      },
    }),
    // ...add more providers here
  ],
  pages: {
    newUser: "/",
  },
};
export default NextAuth(authOptions);
