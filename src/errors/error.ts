export abstract class ApiError extends Error {
  abstract readonly statusCode: number
  abstract readonly name: string
  abstract readonly message: string
}
