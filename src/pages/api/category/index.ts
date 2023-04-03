import { Prisma } from '@prisma/client';
import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/prisma';

// Form Validation Schema
const formSchema = Joi.object({
  name: Joi.string().min(3).required(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      console.log(req.query);
      let categories;
      if (req.query) {
        categories = await prisma.category.findMany({
          skip: (Number(req.query.page) - 1) * Number(req.query.limit),
          take: Number(req.query.limit),
        })
      } else {
        categories = prisma.category.findMany();
      }
      res.status(200).json(categories);
      break;

    case "POST":
      const { error, value } = formSchema.validate(req.body)
      if (!error) {
        try {
          const newCategory = await prisma.category.create({
            data: {
              name: value.name
            },
          })
          return res.status(200).json(newCategory)
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              return res.status(400).json({ message: "User name is already exist" })
            }
          }
        }
      }
      break;
    default:
      return res.status(405).json({ message: "Method is not allowed" });
  }
}
