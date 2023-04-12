import { Prisma } from '@prisma/client';
import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/prisma';

// Form Validation Schema
const formSchema = Joi.object({
  name: Joi.string().min(3).max(24).required(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let category;
  switch (req.method) {
    case "GET":
      category = await prisma.category.findUnique({
        where: {
          id: Number(req.query.id)
        }
      })
      return res.status(200).json(category);
    case "PATCH":
      const { error, value } = formSchema.validate(req.body)

      if (!error) {
        try {
          category = await prisma.category.update({
            where: {
              id: Number(req.query.id)
            },
            data: {
              name: value.name
            }
          })
          res.status(200).json({ message: "Category is updated" })
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              return res.status(400).json({ message: "Cannot update category" })
            }
          }
        }
      } else {
        return res.status(400).json(error);
      }
      break;
    case "DELETE":
      category = await prisma.category.delete({
        where: {
          id: Number(req.query.id)
        }
      })
      if (category) {
        return res.status(200).json({ message: "Deleted successfully" });
      }
      break;
    default:
      return res.status(405).json({ message: "Method is not allowed" });
  }
}
