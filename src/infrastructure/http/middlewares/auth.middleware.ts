import { auth } from "../../firebase/firebase";

export async function authMiddleware(req: any, res: any, next: any) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = header.split(" ")[1];
    req.user = await auth.verifyIdToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}