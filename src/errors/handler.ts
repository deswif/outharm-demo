import { NextFunction, Request, Response } from "express"
import { UnknownError } from "./baseError"
import { ApiError } from "./error"

export default function handleErrors(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json(err)
    next(err)
    return
  }
  res.status(500).json(new UnknownError())
  next(err)
}