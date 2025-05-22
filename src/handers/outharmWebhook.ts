import { Request, Response } from "express"
import * as process from "node:process"
import prisma from "../database"

export default async function outharmWebhook(req: Request, res: Response) {
  const authHeader = req.headers.authorization

  if (authHeader !== `Bearer ${process.env.OUTHARM_WEBHOOK_SECRET}`) {
    res.status(401).json({ error: "Not authorized" })
    return
  }

  const body = req.body

  if (body.event === "moderation-completed") {
    const isHarmful = body.data.isHarmful
    const requestId = body.data.moderationRequestId

    if (isHarmful) {
      await prisma.feed.delete({
        where: {
          outharmRequestId: requestId,
        },
      })
      // Delete image from storage
    } else {
      await prisma.feed.update({
        where: {
          outharmRequestId: requestId,
        },
        data: {
          outharmIsHarmful: false,
        },
      })
    }
  }
}
