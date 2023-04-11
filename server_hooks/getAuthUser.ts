import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import prisma from "../prisma/prisma";

export default async function getAuthUser(
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"]
) {
  const session = await getServerSession(req, res, authOptions)

  const user = await prisma.user.findUnique({
    where: {
      id: session?.user?.id
    }
  })
  return user;
}