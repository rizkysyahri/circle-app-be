import * as express from "express";
import ThreadControllers from "../controllers/thread";
import AuthenticationMiddleware from "../middleware/authentication";
import uploadCloudinary from "../middleware/uploadCloudinary";

const threadRouter = express.Router();
const authenticationMiddleware = new AuthenticationMiddleware();

threadRouter.get("/threads", ThreadControllers.getThreads);
threadRouter.get(
  "/threads/users/:userId",
  authenticationMiddleware.Auth,
  ThreadControllers.getThreadTokenById
);
threadRouter.get("/threads/:id", ThreadControllers.getThreadById);
threadRouter.get("/replies/:threadId", ThreadControllers.getReplies);
threadRouter.post(
  "/threads",
  authenticationMiddleware.Auth,
  uploadCloudinary("image"),
  ThreadControllers.createThread
);
threadRouter.delete(
  "/thread/:threadId",
  authenticationMiddleware.Auth,
  ThreadControllers.deleteThread
);

export default threadRouter;
