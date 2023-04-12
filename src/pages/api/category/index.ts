import { Prisma } from '@prisma/client';
import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/prisma';
import getAuthUser from '../../../../server_hooks/getAuthUser';

// Form Validation Schema
const formSchema = Joi.object({
  name: Joi.string().min(3).max(24).required(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await getAuthUser(req, res);

  switch (req.method) {
    case "GET":
      console.log(req.query);
      let categories;
      if (req.query) {
        categories = await prisma.category.findMany({
          skip: (Number(req.query.page) - 1) * Number(req.query.limit),
          take: Number(req.query.limit),
          where: {
            userId: user?.id
          }
        })
      } else {
        categories = prisma.category.findMany();
      }
      res.status(200).json(categories);
      break;

    case "POST":
      const { error, value } = formSchema.validate(req.body)
      // Checking for permission
      if (!error) {
        try {
          const newCategory = await prisma.category.create({
            data: {
              name: value.name,
              userId: user?.id
            },
          })
          return res.status(200).json(newCategory)
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              return res.status(400).json({ message: "Category is already exist" })
            }
          }
        }
      } else {
        return res.status(400).json(error);
      }
      break;
    default:
      return res.status(405).json({ message: "Method is not allowed" });
  }
}
