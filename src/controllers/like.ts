import { Request, Response } from "express";
import LikeService from "../service/like";

class LikeControllers {
  static async createLike(req: Request, res: Response) {
    try {
      const userId = res.locals.user;
      const { threadId } = req.body;
      console.log(threadId);

      await LikeService.createLike({ userId, threadId });

      res.status(200).json({
        status: true,
        message: "success",
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getLikes(req: Request, res: Response): Promise<any> {
    try {
      const { threadId } = req.params;

      const likes = await LikeService.getLike(+threadId);

      res.status(200).json({
        status: true,
        message: "success",
        data: {
          user: likes,
        },
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getCurrentLike(req: Request, res: Response): Promise<any> {
    try {
      const { threadId } = req.params;
      const userId = res.locals.user;

      const like = await LikeService.getCurrentLike(+threadId, +userId);

      res.status(200).json({
        status: true,
        message: "success",
        data: {
          like,
        },
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }
}

export default LikeControllers;
