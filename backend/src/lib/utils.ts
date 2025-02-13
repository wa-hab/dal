import type { Response, Request, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiResponse } from "./types";

export const sendResponse = <DataType, ErrorType>(
  res: Response,
  data: DataType | null = null,
  error: ErrorType | null = null,
  status: number = 200,
): Response<ApiResponse<DataType, ErrorType>> => {
  const response: ApiResponse<DataType, ErrorType> = {
    data,
    error,
  };

  return res.status(status).json(response);
};

export const sendZodErrorResponse = (
  res: Response,
  error: string,
): Response => {
  return sendResponse(res, null, error, 422);
};

export const sendGenericErrorResponse = (
  res: Response,
  error: string = "Server Error",
): Response => {
  return sendResponse(res, null, error, 500);
};

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendZodErrorResponse(res, error.errors[0]?.message);
      }

      console.error(
        `Validating request for path: ${req.path}. Unexpected error in validation middleware: ${JSON.stringify(error)}`,
      );

      return sendGenericErrorResponse(res);
    }
  };
};
