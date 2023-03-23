import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const posts = prisma.post.findMany();
    return res.status(200).json(posts)
  }
  if (req.method === "POST") {
    console.log(typeof req.body.description);

    if (req.body.description !== "" && req.body.id !== "") {
      const newPost = await prisma.post.create({
        data: {
          description: req.body.description,
          user: {
            connectOrCreate: req.body.id
          }
        }
      })
      return res.status(200).json({ newPost })
    }
  }
  return res.status(404);
}