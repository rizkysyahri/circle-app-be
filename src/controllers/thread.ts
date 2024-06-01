import { Request, Response } from "express";
import ThreadService from "../service/thread";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

class ThreadControllers {
  static async getThreads(req: Request, res: Response) {
    try {
      const threads = await ThreadService.getThreads();

      res.status(200).json({ status: true, data: threads });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async createThread(req: Request, res: Response) {
    try {
      const { body } = req;
      body.userId = res.locals.user;

      const thread = await ThreadService.createThread(body);

      res
        .status(200)
        .json({ message: "Thread created successfully", data: thread });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getThreadById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const threadById = await ThreadService.getThreadById(+id);

      res
        .status(200)
        .json({ message: "success", status: true, data: threadById });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async deleteThread(req: Request, res: Response) {
    try {
      const { threadId } = req.params;
      const userId = res.locals.user;

      console.log("ini id thread", threadId);

      await ThreadService.deleteThreadByUserId(+threadId, userId);

      res
        .status(200)
        .send({ status: true, message: "Deleted thread successfully" });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
      console.log(error);
    }
  }

  static async getReplies(req: Request, res: Response): Promise<any> {
    try {
      const { threadId } = req.params;
      const threadReplies = await ThreadService.getReplies(+threadId);

      res
        .status(200)
        .json({ status: true, message: "success", data: threadReplies });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getThreadTokenById(req: Request, res: Response): Promise<any> {
    try {
      const userId = res.locals.user;
      const threadToken = await ThreadService.getThreadTokenById(userId);

      res
        .status(200)
        .json({ status: true, message: "success", data: threadToken });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  // static async getThreadByUsername(req: Request, res: Response): Promise<any> {
  //   try {
  //     const threadUser = await ThreadService.getThreadByUsername();
  //     res
  //       .status(200)
  //       .json({ status: true, message: "success", data: threadUser });
  //   } catch (error) {
  //     const err = error as unknown as Error;
  //     res.status(500).json({ message: err.message, status: false });
  //   }
  // }
}

export default ThreadControllers;
