import { TaskRepository } from "../repositories/TaskRepository";

export class GetTaskById {
  constructor(private repo: TaskRepository) {}

  execute(taskId: string) {
    return this.repo.getById(taskId);
  }
}