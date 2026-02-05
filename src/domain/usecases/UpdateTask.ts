import { TaskRepository } from "../repositories/TaskRepository";
import { Task } from "../entities/Task";

export class UpdateTask {
  constructor(private repo: TaskRepository) {}

  execute(taskId: string, task: Task) {
    if (!task.title) throw new Error("Title required");
    return this.repo.update(taskId, task);
  }
}