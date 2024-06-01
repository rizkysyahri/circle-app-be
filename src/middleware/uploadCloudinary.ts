import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  secure: true,
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + file.originalname.replace(/\s/g, "")
    );
  },
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 1024 * 1024 * 2,
  },
}).fields([
  {
    name: "image",
    maxCount: 4,
  },
]);

const uploadCloudinary = (fieldname: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            status: false,
            message: "File to large",
          });
        }

        return res.status(500).json({
          status: false,
          message: err.message,
        });
      }

      if (req.files) {
        try {
          const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
          };
          const { image } = files;

          if (image && image.length > 0) {
            const imageUrl = await Promise.all(
              image.map(async (img) => {
                try {
                  const imgUrl = await cloudinary.uploader.upload(img.path, {
                    folder: "uploads",
                  });
                  const images = {
                    image: imgUrl.secure_url,
                  };

                  return images;
                } catch (error) {
                  console.log(error);
                  throw error;
                }
              })
            );
            req.body.images = imageUrl;
          }
        } catch (error) {
          console.log(error);
        }
      }

      return next();
    });
  };
};

export default uploadCloudinary;
