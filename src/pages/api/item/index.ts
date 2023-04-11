import { Prisma } from '@prisma/client';
import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/prisma';

// Form Validation Schema
const formSchema = Joi.object({
  name: Joi.string().min(3).required(),
  categoryId: Joi.number().required(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      break;

    case "POST":
      const { error, value } = formSchema.validate(req.body)
      if (!error) {
        try {
          const newItem = await prisma.item.create({
            data: {
              name: value.name,
              category: {
                connect: {
                  id: value.categoryId
                }
              }
            },
          })
          return res.status(200).json(newItem)
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              return res.status(400).json({ message: "Category is already exist" })
            }
          }
        }
      }
      break;
    default:
      return res.status(405).json({ message: "Method is not allowed" });
  }
}
