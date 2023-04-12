import { Prisma } from '@prisma/client';
import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../prisma/prisma';
import getAuthUserId from '../../../../server_hooks/getAuthUserId';

// Form Validation Schema
const formSchema = Joi.object({
  name: Joi.string().min(3).required(),
  categoryId: Joi.number().required(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const userId = await getAuthUserId(req, res);

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
              },
              user: {
                connect: {
                  id: userId
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
      } else {
        return res.status(400).json(error);
      }
      break;
    default:
      return res.status(405).json({ message: "Method is not allowed" });
  }
}
