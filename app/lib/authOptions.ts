import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = {
          id: "1",
          username: process.env.NEXT_PUBLIC_ADMIN_USER,
        };

        const isValidUser =
          credentials?.username === process.env.NEXT_PUBLIC_ADMIN_USER;
        const isValidPassword =
          credentials?.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

        if (isValidUser && isValidPassword) {
          return user;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin",
  },
  callbacks: {
    session: ({ session }) => {
      return session;
    },
    jwt: ({ token }) => {
      return token;
    },
    redirect: async (params) => {
      return params.url.startsWith(params.baseUrl)
        ? params.url
        : `${params.baseUrl}/admin`;
    },
  },
};

export default authOptions;
