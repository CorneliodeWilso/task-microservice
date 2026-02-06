import { Request, Response } from "express";
import { TaskRepositoryFirestore } from "../../firebase/TaskRepositoryFirestore";
import { GetTasks } from "../../../domain/usecases/GetTasks";
import { CreateTask } from "../../../domain/usecases/CreateTask";
import { GetTaskById } from "../../../domain/usecases/GetTaskById";
import { UpdateTask } from "../../../domain/usecases/UpdateTask";
import { DeleteTask } from "../../../domain/usecases/DeleteTask";
import { TASK_MESSAGES } from "../../../domain/constants/task.constants";
import { ResponseModel } from "../../../domain/models/ResponseModel";
import { RESPONSE_CODES } from "../../../domain/constants/responseCodes.constants";


const repo = new TaskRepositoryFirestore();

export class TaskController {

   static async getAll(req: Request, res: Response) {
    const usecase = new GetTasks(repo);
    const tasks = await usecase.execute();

    const response = new ResponseModel(
      RESPONSE_CODES.SUCCESS,
      TASK_MESSAGES.FETCH_SUCCESS,
      tasks
    );

    return res.status(response.code).json(response);
  }

  static async getById(req: Request, res: Response) {
    const id = req.params.id as string;

    const usecase = new GetTaskById(repo);
    const task = await usecase.execute(id);

    if (!task) {
      const response = new ResponseModel(
        RESPONSE_CODES.NOT_FOUND,
        TASK_MESSAGES.NOT_FOUND
      );
      return res.status(response.code).json(response);
    }

    const response = new ResponseModel(
      RESPONSE_CODES.SUCCESS,
      TASK_MESSAGES.FETCH_ONE_SUCCESS,
      task
    );

    return res.status(response.code).json(response);
  }

  static async create(req: Request, res: Response) {
    const usecase = new CreateTask(repo);
    const id = await usecase.execute(req.body);

    const response = new ResponseModel(
      RESPONSE_CODES.CREATED,
      TASK_MESSAGES.CREATED,
      { id }
    );

    return res.status(response.code).json(response);
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const data = req.body;

    const usecase = new UpdateTask(repo);

    try {
      await usecase.execute(id, data);

      const response = new ResponseModel(
        RESPONSE_CODES.SUCCESS,
        TASK_MESSAGES.UPDATED
      );

      return res.status(response.code).json(response);

    } catch (error) {
      const response = new ResponseModel(
        RESPONSE_CODES.INTERNAL_ERROR,
        TASK_MESSAGES.UPDATE_ERROR
      );

      return res.status(response.code).json(response);
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id as string;

    const usecase = new DeleteTask(repo);

    try {
      await usecase.execute(id);

      const response = new ResponseModel(
        RESPONSE_CODES.SUCCESS,
        TASK_MESSAGES.DELETED
      );

      return res.status(response.code).json(response);

    } catch (error) {
      const response = new ResponseModel(
        RESPONSE_CODES.INTERNAL_ERROR,
        TASK_MESSAGES.DELETE_ERROR
      );

      return res.status(response.code).json(response);
    }
  }
}