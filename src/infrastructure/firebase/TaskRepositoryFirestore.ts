import { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Task } from "../../domain/entities/Task";
import { db, timestamp } from "./firebase";

export class TaskRepositoryFirestore implements TaskRepository {
  async getAll(): Promise<Task[]> {
    const snapshot = await db.collection("tasks").get();

    return snapshot.docs.map((doc) => {
      const data = doc.data() as Task;
      let createdAt = null;

      if (data.createdAt && typeof data.createdAt.toDate === "function") {
        createdAt = data.createdAt.toDate().toISOString();
      }

      return {
        id: doc.id,
        ...data,
        createdAt,
      };
    });
  }

  async getById(id: string): Promise<Task | null> {
    const doc = await db.collection("tasks").doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data() as Task;
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
    };
  }

  async create(task: Task): Promise<string> {
    const ref = await db.collection("tasks").add({
      ...task,
      createdAt: timestamp(),
    });
    return ref.id;
  }

  async update(id: string, task: Partial<Task>): Promise<void> {
    const updateData: Partial<Task> = {};

    if (typeof task.title === "string") {
      updateData.title = task.title;
    }

    if (typeof task.description === "string") {
      updateData.description = task.description;
    }

    if (typeof task.completed === "boolean") {
      updateData.completed = task.completed;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error("No valid fields to update");
    }

    await db.collection("tasks").doc(id).update(updateData);
  }

  async delete(id: string): Promise<void> {
    await db.collection("tasks").doc(id).delete();
  }
}
