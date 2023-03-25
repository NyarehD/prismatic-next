import { AuthOptions } from "next-auth";
import NextAuth from "next-auth/next"

export const authOptions: AuthOptions = {
  providers: [

  ],
  pages: {
  }
}
export default NextAuth(authOptions);