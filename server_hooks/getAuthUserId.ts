import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

/**
 * Get only User id
 * @param req
 * @param res
 * @returns A promise of user id
 */
export default async function getAuthUserId(
  req: NextApiRequest | GetServerSidePropsContext["req"],
  res: NextApiResponse | GetServerSidePropsContext["res"]
): Promise<string> {
  const session = await getServerSession(req, res, authOptions)
  return session?.user.id;
}