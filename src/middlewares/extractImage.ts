import { Request, Response, NextFunction } from "express"
import { fileTypeFromBuffer } from "file-type"
import { v4 as uuid } from "uuid"
import imageUploader from "../uploaders/imageUploader";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  await imageUploader.single("image")(req, res, async function (err) {
    const image = req.file

    if (image === undefined) {
      next(new Error("No image"))
      return
    }

    const imageExt = await fileTypeFromBuffer(image.buffer).then((e) => e?.ext)

    if (!imageExt) {
      next(new Error("No image type"))
      return
    }

    let imageName = uuid() + "." + imageExt

    res.locals.image = new ApiImage(image.buffer, imageName)
    next()
  })
}

export class ApiImage {
  buffer: Buffer
  filename: string

  constructor(buffer: Buffer, filename: string) {
    this.buffer = buffer
    this.filename = filename
  }
}
