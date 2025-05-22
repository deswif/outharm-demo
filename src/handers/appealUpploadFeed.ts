import { Request, Response } from "express"
import prisma from "../database"
import {UnknownError} from "../errors/baseError";
import * as process from "node:process";

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

  // Double check that the image is harmful because we do not want to appeal harmless prediction
  if (!feed.outharmIsHarmful) {
    throw new UnknownError()
  }

  const requestId = await appeal(feed.outharmPredictionId)

  await prisma.feed.update({
    where: {
      id: feedId,
    },
    data: {
      outharmRequestId: requestId,
    }
  })

  res.sendStatus(200)
}

async function appeal(predictionId: number) {
  const response = await fetch(`https://api.outharm.com/manual/appeal/${predictionId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OUTHARM_TOKEN}`
    }
  });

  if (!response.ok) {
    throw new UnknownError()
  }

  const body = await response.json()

  return body.requestId
}
