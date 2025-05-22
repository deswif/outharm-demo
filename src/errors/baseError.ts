import { ApiError } from "./error"

export class UnknownError extends ApiError {
  readonly name: string = "unknown"
  readonly message: string = "Unknown Server Error"
  readonly statusCode: number = 500
}

export class ImageHarmfulError extends ApiError {
  readonly name: string = "image-harmful"
  readonly message: string = "Your image contains harmful content"
  readonly statusCode: number = 403
}
