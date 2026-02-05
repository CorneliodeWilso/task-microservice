import { Request, Response } from "express";
import fetch from "node-fetch";
import * as admin from "firebase-admin";
export class AuthController {
    
  static async login(req: Request, res: Response) {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    try {
      const apiKey = process.env.ATOM_FIREBASE_API_KEY;

      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          })
        }
      );

      const data: any = await response.json();

      if (!response.ok) {
        return res.status(401).json({ message: "Invalid credentials", error: data });
      }

      // ✅ Firebase devuelve idToken
      return res.json({
        token: data.idToken,
        refreshToken: data.refreshToken
      });

    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  }

 static async register(req: Request, res: Response) {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const apiKey = process.env.ATOM_FIREBASE_API_KEY;

    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true
        })
      }
    );

    const data: any = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        message: "Register failed",
        error: data.error?.message
      });
    }

    // ✅ Firebase devuelve idToken real
    return res.status(201).json({
      message: "User created successfully",
      token: data.idToken
    });

  } catch (error) {
    return res.status(500).json({
      message: "Register error"
    });
  }
}
}