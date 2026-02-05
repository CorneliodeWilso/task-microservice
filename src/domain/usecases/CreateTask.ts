import { TaskRepository } from "../repositories/TaskRepository";
import { Task } from "../entities/Task";

export class CreateTask {
  constructor(private repo: TaskRepository) {}

  execute(task: Task) {
    if (!task.title) throw new Error("Title required");
    return this.repo.create(task);
  }
}