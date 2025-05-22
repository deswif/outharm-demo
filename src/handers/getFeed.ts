import { Request, Response } from "express"
import prisma from "../database"

export default async function (req: Request, res: Response) {
  const feed = await prisma.feed.findMany({
    where: {
      outharmIsHarmful: false,
    },
    omit: {
      outharmIsHarmful: true,
      outharmPredictionId: true,
      outharmRequestId: true,
    },
  })

  res.status(200).json(feed)
}
