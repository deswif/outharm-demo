import { Request, Response } from "express"
import prisma from "../database"
import { UnknownError } from "../errors/baseError"
import * as process from "node:process"

export default async function (req: Request, res: Response) {
  const feedId = Number(req.params.feedId)

  const feed = await prisma.feed.findUnique({
    where: {
      id: feedId,
    },
  })

  if (!feed) {
    throw new UnknownError()
  }

  // Double check that we report false negative (Harmless) image
  if (feed.outharmIsHarmful) {
    throw new UnknownError()
  }

  const reportRes = await reportFeed(feed.outharmPredictionId)


  // Response when the report triggers manual moderation, we update the request id
  // Possible statuses: reported, pending-moderation. We need the second one to obtain the id
  // Docs: The moderation request ID (only present when status is "pending-moderation")
  if (reportRes.status === "pending-moderation") {
    await prisma.feed.update({
      where: {
        id: feedId,
      },
      data: {
        outharmRequestId: reportRes.data.requestId,
      },
    })
  }

  res.sendStatus(200)
}

async function reportFeed(predictionId: number) {
  const response = await fetch(
    `https://api.outharm.com/manual/report/${predictionId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OUTHARM_TOKEN}`,
      },
    },
  )

  if (!response.ok) {
    throw new UnknownError()
  }

  return response.json()
}
