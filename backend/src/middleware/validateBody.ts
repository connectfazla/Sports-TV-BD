import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { badRequest } from '../utils/response';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      badRequest(res, result.error.flatten().fieldErrors as unknown as string);
      return;
    }
    req.body = result.data;
    next();
  };
}
