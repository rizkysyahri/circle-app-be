import * as express from "express";
import userRouter from "./userRouter";
import followRouter from "./useFollow";
import threadRouter from "./userThread";
import likeRouter from "./userLike";
import profileRouter from "./userProfile";
import cloudinary from "../lib/cloudinary";

const Route = express.Router();

cloudinary.config();

Route.use("/", userRouter);
Route.use("/", profileRouter);
Route.use("/", followRouter);
Route.use("/", threadRouter);
Route.use("/", likeRouter);

export default Route;
