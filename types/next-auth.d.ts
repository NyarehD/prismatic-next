import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    // To include id in the useSession()
    user: {
      id
    }
  }
}