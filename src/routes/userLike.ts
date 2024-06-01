import * as express from "express";
import AuthenticationMiddleware from "../middleware/authentication";
import LikeControllers from "../controllers/like";

const likeRouter = express.Router();
const authenticationMiddleware = new AuthenticationMiddleware();

likeRouter.post(
  "/likes",
  authenticationMiddleware.Auth,
  LikeControllers.createLike
);
likeRouter.get(
  "/likes/:threadId",
  authenticationMiddleware.Auth,
  LikeControllers.getLikes
);

likeRouter.get(
  "/like/:threadId",
  authenticationMiddleware.Auth,
  LikeControllers.getCurrentLike
);

export default likeRouter;
