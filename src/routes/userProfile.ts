import * as express from "express";
import AuthenticationMiddleware from "../middleware/authentication";
import ProfileControllers from "../controllers/profile";
import uploadMiddleware from "../middleware/upload";

const profileRouter = express.Router();
const authenticationMiddleware = new AuthenticationMiddleware();

profileRouter.patch(
  "/profiles",
  authenticationMiddleware.Auth,
  uploadMiddleware("cover"),
  ProfileControllers.updateProfile
);
profileRouter.get("/profile", authenticationMiddleware.Auth, ProfileControllers.getProfile)

export default profileRouter;
  