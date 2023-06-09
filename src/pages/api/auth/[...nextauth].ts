import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import checkPassword from "../../../../lib/checkPassword";
import prisma from "../../../../prisma/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findFirst({
          where: {
            username: credentials?.username
          }
        })
        if (user && await checkPassword(credentials?.password, user.password)) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login"
  }
}
export default NextAuth(authOptions);