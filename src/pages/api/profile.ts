// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "GET") {
    console.log("GET");
    res.status(200).json({ name: "test" });
  } else if (req.method === "POST") {
    console.log(req.body.id);

    const newProfile = await prisma.profile.create({
      data: {
        userId: req.body.id
      },
    })
    return res.status(200).json({ newProfile })
  } else {
    return res.status(404);
  }

}
