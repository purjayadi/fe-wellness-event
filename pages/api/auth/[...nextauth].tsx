import { DefaultSession, User } from "next-auth";
import { decode, JWT, JWTDecodeParams, JWTEncodeParams } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | undefined;
      username?: Date | undefined;
      name?: string | undefined;
      role?: string | undefined;
    } & DefaultSession["user"];
  }
}
export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "username", type: "username", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetch(
          "https://api-booking-event.herokuapp.com/login",
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );
        const json = await res.json();

        // If no error and we have user data, return it
        if (res.ok) {
          return json;
        }
        // Return null if user data could not be retrieved
        return null;

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      },
    })
  ],
  session: {
    // max age 1 day
    strategy: "jwt",
    maxAge: 1000 * 60 * 60 * 24,
  },
  jwt: {
    // The secret for signing the JWT
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    maxAge: 1000 * 60 * 60 * 24,
  },
  secret: process.env.JWT_SECRET,
  // jwt: {
  //   secret: process.env.JWT_SECRET,
  // },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      // Create a token
      if (user?.success === true) return true;
      else return false;
    },
    async session({ session, token }) {
      session.user = {
        // @ts-ignore
        ...token?.user,
      };
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        const { accessToken, ...rest } = user;
        token.accessToken = accessToken;
        token.user = rest.user;
      }

      return token;
    },
  },
});
