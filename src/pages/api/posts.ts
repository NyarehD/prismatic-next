import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const posts = prisma.post.findMany();
    return res.status(200).json(posts)
  }
  if (req.method === "POST") {
    console.log(req.body.userId);

    const newPost = await prisma.post.create({
      data: {
        description: req.body.description,
        userId: req.body.userId
      }
    })
    return res.status(200).json({ newPost })
  }
  return res.status(404);
}