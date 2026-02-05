import { Request, Response } from "express";
import { TaskRepositoryFirestore } from "../../firebase/TaskRepositoryFirestore";
import { GetTasks } from "../../../domain/usecases/GetTasks";
import { CreateTask } from "../../../domain/usecases/CreateTask";
import { GetTaskById } from "../../../domain/usecases/GetTaskById";
import { UpdateTask } from "../../../domain/usecases/UpdateTask";
import { DeleteTask } from "../../../domain/usecases/DeleteTask";


const repo = new TaskRepositoryFirestore();

export class TaskController {

  static async getAll(req: Request, res: Response) {
    const usecase = new GetTasks(repo);
    const tasks = await usecase.execute();
    res.json(tasks);
  }

  static async getById(req: Request, res: Response) {
    const  id  = req.params.id as string;

    const usecase = new GetTaskById(repo);
    const task = await usecase.execute(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  }

  static async create(req: Request, res: Response) {
    const usecase = new CreateTask(repo);
    const id = await usecase.execute(req.body);
    res.status(201).json({ id });
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body;

    const usecase = new UpdateTask(repo);

    try {
      await usecase.execute(id, data);
      res.json({ message: "Task updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating task" });
    }
  }

   static async delete(req: Request, res: Response) {
    const id  = req.params.id as string;

    const usecase = new DeleteTask(repo);

    try {
      await usecase.execute(id);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task" });
    }
  }
}