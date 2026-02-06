import { AUTH_MESSAGES } from "../../../domain/constants/auth.constants";
import { RESPONSE_CODES } from "../../../domain/constants/responseCodes.constants";
import { ResponseModel } from "../../../domain/models/ResponseModel";
import { auth } from "../../firebase/firebase";
import type { Request as ExpressRequest, Response, NextFunction } from 'express';

export async function authMiddleware(
  req: ExpressRequest  & { user?: any },
  res: Response,
  next: NextFunction
) {
  const header = req.get('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    const response = new ResponseModel(
      RESPONSE_CODES.UNAUTHORIZED,
      AUTH_MESSAGES.UNAUTHORIZED
    );
    return res.status(response.code).json(response);
  }

  try {
    const token = header.split(' ')[1];
    req.user = await auth.verifyIdToken(token);
    next();
  } catch (error) {
    const response = new ResponseModel(
      RESPONSE_CODES.INTERNAL_ERROR,
      AUTH_MESSAGES.INVALID_TOKEN
    );
    return res.status(response.code).json(response);
  }
}