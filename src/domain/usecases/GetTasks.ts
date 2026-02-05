import { TaskRepository } from "../repositories/TaskRepository";

export class GetTasks {
  constructor(private repo: TaskRepository) {}

  execute() {
    return this.repo.getAll();
  }
}