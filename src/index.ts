
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Auth middleware
async function authMiddleware(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

// Tasks
app.get("/tasks", authMiddleware, async (_, res) => {
  const snapshot = await db.collection("tasks").get();
  const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(tasks);
});

app.get("/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await db.collection("tasks").doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task" });
  }
});

app.post("/tasks", authMiddleware, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ message: "Title required" });

  const task = {
    title,
    description: description || "",
    completed: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  const ref = await db.collection("tasks").add(task);
  res.status(201).json({ id: ref.id });
});

app.put("/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).update(req.body);
  res.json({ message: "Updated" });
});

app.delete("/tasks/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await db.collection("tasks").doc(id).delete();
  res.json({ message: "Deleted" });
});

export const api = functions.region("us-central1").https.onRequest(app);
