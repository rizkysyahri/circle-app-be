import * as express from "express";
import FollowController from "../controllers/follow";
import AuthenticationMiddleware from "../middleware/authentication";

const followRouter = express.Router();
const authenticationMiddleware = new AuthenticationMiddleware();

followRouter.get("/check-follow/:id_user", authenticationMiddleware.Auth, FollowController.checkFollowStatus)

followRouter.get(
  "/followers/:followingId",
  authenticationMiddleware.Auth,
  FollowController.getFollowers
);
followRouter.get(
  "/followers",
  authenticationMiddleware.Auth,
  FollowController.getFollowersUsers
);
followRouter.get(
  "/followings",
  authenticationMiddleware.Auth,
  FollowController.getFollowingUsers
);

followRouter.get(
  "/follower/:followingId",
  authenticationMiddleware.Auth,
  FollowController.getCurrentFollowingId
);
followRouter.get("/following/:followerId", FollowController.getFollowingId);
followRouter.post(
  "/follow",
  authenticationMiddleware.Auth,
  FollowController.follow
);

export default followRouter;
