import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthMiddlewareData } from "../types/app";

export default class AuthenticationMiddleware {
  Auth(req: Request, res: Response, next: NextFunction) {
    try {
      const authorization = req.headers.authorization;
      const token = authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
        });
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY!);

      if (!decoded) {
        return res.status(401).json({
          status: false,
          message: "Unauthorized",
        });
      }

      console.log(decoded);

      res.locals.user = (decoded as AuthMiddlewareData).id;

      return next();
    } catch (error) {
      const err = error as unknown as Error;
      console.log(err);

      res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
}
