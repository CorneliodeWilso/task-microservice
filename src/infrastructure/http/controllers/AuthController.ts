import { Request, Response } from "express";
import fetch from "node-fetch";
import * as admin from "firebase-admin";
import { ResponseModel } from "../../../domain/models/ResponseModel";
import { RESPONSE_CODES } from "../../../domain/constants/responseCodes.constants";
import { AUTH_MESSAGES } from "../../../domain/constants/auth.constants";
import { CONSTANTS } from "../../../domain/constants/contants";
import { ATOM_FIREBASE_API_KEY } from "../../../index";

export class AuthController {
 static async login(req: Request, res: Response) {
    
    const { email, password } = req.body;

    if (!email || !password) {
      const response = new ResponseModel(
        RESPONSE_CODES.BAD_REQUEST,
        AUTH_MESSAGES.EMAIL_PASSWORD_REQUIRED
      );
      return res.status(response.code).json(response);
    }

    try {
            console.log('Using Firebase API KEY:');

      const apiKey = ATOM_FIREBASE_API_KEY.value();
      console.log('Using Firebase API KEY:', apiKey?.substring(0, 6));
      const firebaseResponse = await fetch(
        `${CONSTANTS.googleApi}signInWithPassword?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );

      const data: any = await firebaseResponse.json();

      if (!firebaseResponse.ok) {
        const response = new ResponseModel(
          RESPONSE_CODES.UNAUTHORIZED,
          AUTH_MESSAGES.INVALID_CREDENTIALS
        );
        return res.status(response.code).json(response);
      }

      const response = new ResponseModel(
        RESPONSE_CODES.SUCCESS,
        AUTH_MESSAGES.LOGIN_SUCCESS,
        {
          token: data.idToken,
          refreshToken: data.refreshToken
        }
      );

      return res.status(response.code).json(response);

    } catch (error) {
      const response = new ResponseModel(
        RESPONSE_CODES.INTERNAL_ERROR,
        AUTH_MESSAGES.LOGIN_FAILED
      );
      return res.status(response.code).json(response);
    }
  }


 static async register(req: Request, res: Response) {

    const { email, password } = req.body;

    if (!email || !password) {
      const response = new ResponseModel(
        RESPONSE_CODES.BAD_REQUEST,
        AUTH_MESSAGES.EMAIL_PASSWORD_REQUIRED
      );
      return res.status(response.code).json(response);
    }

    try {
      const apiKey = ATOM_FIREBASE_API_KEY.value();

      const firebaseResponse = await fetch(
        `${CONSTANTS.googleApi}signUp?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );

      const data: any = await firebaseResponse.json();

      if (!firebaseResponse.ok) {
        const response = new ResponseModel(
          RESPONSE_CODES.BAD_REQUEST,
          AUTH_MESSAGES.REGISTER_FAILED
        );
        return res.status(response.code).json(response);
      }

      const response = new ResponseModel(
        RESPONSE_CODES.SUCCESS,
        AUTH_MESSAGES.REGISTER_SUCCESS,
        {
          token: data.idToken
        }
      );

      return res.status(response.code).json(response);

    } catch (error) {
      const response = new ResponseModel(
        RESPONSE_CODES.INTERNAL_ERROR,
        AUTH_MESSAGES.REGISTER_ERROR
      );
      return res.status(response.code).json(response);
    }
  }
}