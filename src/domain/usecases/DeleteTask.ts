import { TaskRepository } from "../repositories/TaskRepository";

export class DeleteTask {
  constructor(private repo: TaskRepository) {}

  execute(taskId: string) {
    return this.repo.delete(taskId);
  }
}