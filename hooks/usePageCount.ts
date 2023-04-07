import prisma from "../prisma/prisma";

export default async function usePageCount(take: number) {
  return Math.ceil((await prisma.category.findMany()).length / take)
}