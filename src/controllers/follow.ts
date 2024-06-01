import { Request, Response } from "express";
import FollowService from "../service/follow";

class FollowController {
  static async getFollowers(req: Request, res: Response): Promise<any> {
    try {
      const { followingId } = req.params;
      const followers = await FollowService.getFollowerId(+followingId);

      res.status(200).json({ data: followers });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getFollowingId(req: Request, res: Response): Promise<any> {
    try {
      const followerId = req.params;

      const following = await FollowService.getFollowingId(+followerId);
      res.status(200).json({ data: following });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async follow(req: Request, res: Response): Promise<any> {
    try {
      const { followingId } = req.body;
      const followerId = res.locals.user;

      const follow = await FollowService.follow(followerId, followingId);

      res.status(200).json({ status: true, message: follow });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getFollowingUsers(req: Request, res: Response): Promise<any> {
    try {
      const followerId = res.locals.user;

      const followingUsers = await FollowService.getFollowingsUsers(followerId);

      res.status(200).json({ status: true, data: followingUsers });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getFollowersUsers(req: Request, res: Response): Promise<any> {
    try {
      const followingId = res.locals.user;

      const followersUsers = await FollowService.getFollowersUsers(followingId);

      res.status(200).json({ status: true, data: followersUsers });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getCurrentFollowingId(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const { followingId } = req.params;
      const followerId = res.locals.user;

      const followings = await FollowService.geCurrentFollowingId(
        +followingId,
        followerId
      );

      res.status(200).json({
        status: true,
        message: "success",
        data: {
          followings,
        },
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async checkFollowStatus(req: Request, res: Response): Promise<any> {
    try {
      const { id_user } = req.params;
      const loggedIn = res.locals.user;

      const isFollowings = await FollowService.geCurrentFollowingId(
        +id_user,
        loggedIn
      );

      res.status(200).json({
        status: true,
        message: "success",
        data: isFollowings ? true : false,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }
}

export default FollowController;
