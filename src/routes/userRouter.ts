import * as express from "express";
import UserController from "../controllers/user";
import AuthenticationMiddleware from "../middleware/authentication";

const userRouter = express.Router();
const authenticationMiddleware = new AuthenticationMiddleware();

userRouter.get(
  "/users",
  authenticationMiddleware.Auth,
  UserController.getUsers
);
userRouter.get("/profile/:username", UserController.getProfileUserByUsername);
// userRouter.get("/:username", UserController.getUserByUsername)
userRouter.get("/user", UserController.getUserSearch);
userRouter.get(
  "/other-users",
  authenticationMiddleware.Auth,
  UserController.getOtherUsers
);
userRouter.post("/register", UserController.register);
userRouter.post("/login", UserController.login);

userRouter.post("/forgot-password", UserController.sendEmail)
userRouter.post("/reset-password", UserController.upgradePassword)
export default userRouter;
