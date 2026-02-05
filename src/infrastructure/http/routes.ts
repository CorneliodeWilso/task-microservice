import { Router } from "express";
import { TaskController } from "./controllers/TaskController";
import { authMiddleware } from "./middlewares/auth.middleware";
import { AuthController } from "./controllers/AuthController";

const router = Router();

router.get("/health", (_, res) => res.json({ status: "ok" }));

router.get("/tasks", authMiddleware, TaskController.getAll);
router.post("/tasks", authMiddleware, TaskController.create);
router.get("/tasks/:id", authMiddleware, TaskController.getById);
router.put("/tasks/:id", authMiddleware, TaskController.update);
router.delete("/tasks/:id", authMiddleware, TaskController.delete);
router.post("/auth/login", AuthController.login);
router.post("/auth/register", AuthController.register);
export default router;