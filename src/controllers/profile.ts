import { Request, Response } from "express";
import ProfileService from "../service/profile";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

class ProfileControllers {
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = res.locals.user;
      const { body } = req;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files && files.cover && files.cover[0] && files.cover[0].filename) {
        const coverResult = await cloudinary.uploader.upload(
          files.cover[0].path
        );
        if (coverResult && coverResult.secure_url) {
          body.cover = coverResult.secure_url;
        }
      }

      if (
        files &&
        files.avatar &&
        files.avatar[0] &&
        files.avatar[0].filename
      ) {
        const avatarResult = await cloudinary.uploader.upload(
          files.avatar[0].path
        );

        if (avatarResult && avatarResult.secure_url) {
          body.avatar = avatarResult.secure_url;
        }
      }

      await ProfileService.updateProfile(userId, body);

      res.status(200).json({
        status: true,
        message: "success",
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = res.locals.user;

      const profile = await ProfileService.getProfile(+userId);

      res.status(200).json({
        status: true,
        message: "success",
        data: profile,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(500).json({ message: err.message, status: false });
    }
  }
}

export default ProfileControllers;
