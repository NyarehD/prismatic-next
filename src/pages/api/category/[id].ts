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
    case "PATCH":

      break;
    case "DELETE":
      const category = await prisma.category.delete({
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
