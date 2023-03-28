import { Prisma } from '@prisma/client';
import Joi from 'joi';
import type { NextApiRequest, NextApiResponse } from 'next';
import hashPassword from '../../../lib/hashPassword';
import prisma from '../../../prisma/prisma';

// Form Validation Schema
const formSchema = Joi.object({
  name: Joi.string().min(3).required(),
  userName: Joi.string().min(3).max(15),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.ref("password"),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      res.status(200).json({ name: "test" });
      break;

    case "POST":
      const { error, value } = formSchema.validate(req.body)
      if (!error) {
        try {
          const newUser = await prisma.user.create({
            data: {
              name: value.name,
              username: value.userName,
              password: await hashPassword(value.password)
            },
          })
          return res.status(200).json(newUser)
        } catch (e) {
          if (e instanceof Prisma.PrismaClientKnownRequestError) {
            if (e.code === "P2002") {
              return res.status(400).json({ message: "User name is already exist" })
            }
          }
        }
      } else {
        return res.status(400).json(error);
      }
      break;

    case "PUT":

      break;
    default:
      return res.status(400).json({ message: "Cannot create a user" });
  }
}
