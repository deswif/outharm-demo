import FormData from "form-data"
import { Request, Response } from "express"
import { ApiImage } from "../middlewares/extractImage"
import * as process from "node:process"
import { UnknownError } from "../errors/baseError"
import prisma from "../database"

export default async function (req: Request, res: Response) {
  const image = res.locals.image as ApiImage

  // Moderate
  const moderationRes = await moderateImage(image)

  // Save the image (We also can save the image first and pass image URL to Outharm)
  const imageUrl = await uploadImage(image)

  // Creating our feed. Normally, also we have to create cron job that will delete all harmful posts that were created 24H before
  // so the user can appeal the moderation result within a day
  const feed = await prisma.feed.create({
    data: {
      imageUrl,
      outharmIsHarmful: moderationRes.isHarmful,
      outharmPredictionId: moderationRes.predictionId,
    },
    omit: {
      outharmIsHarmful: true,
      outharmPredictionId: true,
      outharmRequestId: true,
    },
  })

  // If harmful - we need to show the user that he can appeal the image
  res.status(200).send({
    data: feed,
    status: moderationRes.isHarmful ? "harmful" : "success",
  })
}

async function moderateImage(image: ApiImage) {
  const outharmFormData = new FormData()
  outharmFormData.append("image", image.buffer, image.filename)

  const outharmResponse = await fetch(
    "https://api.outharm.com/automated/predict",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OUTHARM_TOKEN}`,
        ...outharmFormData.getHeaders(),
      },
      body: outharmFormData.getBuffer(),
    },
  )

  if (!outharmResponse.ok) {
    throw new UnknownError()
  }

  return outharmResponse.json()
}

async function uploadImage(image: ApiImage) {
  // upload the image somehow into storage. Placeholder for now
  return "https://localhost:8080/storage/832"
}
