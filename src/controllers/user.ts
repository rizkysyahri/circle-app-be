import { Request, Response } from "express";
import UserService from "../service/user";

class UserController {
  static async getUsers(req: Request, res: Response): Promise<any> {
    try {
      const users = await UserService.getUsers();

      res.status(200).json({ status: true, data: users });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async register(req: Request, res: Response): Promise<any> {
    try {
      const { body } = req;

      const result = await UserService.register(body);

      res.status(201).json({
        status: true,
        message: "successfully registered",
        data: result,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async login(req: Request, res: Response): Promise<any> {
    try {
      const { username, password } = req.body;

      const token = await UserService.login(username, password);

      res.status(200).json({ status: true, data: token });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getUserSearch(req: Request, res: Response): Promise<any> {
    try {
      const users = await UserService.getUsersSearch();

      res.status(200).json({ status: true, data: users });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getOtherUsers(req: Request, res: Response): Promise<any> {
    try {
      const id = res.locals.user;

      const others = await UserService.getOtherUsers(id);
      res.status(200).json({ status: true, data: others });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getProfileUserByUsername(
    req: Request,
    res: Response
  ): Promise<any> {
    try {
      const { username } = req.params;

      const user = await UserService.getProfileUserByUsername(username);
      res.status(200).json({ status: true, data: user });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async sendEmail(req: Request, res: Response): Promise<any> {
    try {
      const { username } = req.body;

      const token = await UserService.sendEmail(username);

      res.status(200).json({ status: true, data: token });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async upgradePassword(req: Request, res: Response): Promise<any> {
    try {
      const { password, token } = req.body;

      const user = await UserService.updatePassword(password, token);

      console.log(user);
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserController;
