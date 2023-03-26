import type { NextApiRequest, NextApiResponse } from 'next';
import hashPassword from '../../../lib/hashPassword';
import prisma from '../../../prisma/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    console.log("GET");
    res.status(200).json({ name: "test" });
  } else if (req.method === "POST") {
    if (req.body.name && req.body.email && req.body.password) {
      const newUser = await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: await hashPassword(req.body.password)
        },
      })
      return res.status(200).json({ newUser })
    }
    return res.status(400).json({ message: "Cannot create a user" })
  } else {
    return res.status(404);
  }

}
