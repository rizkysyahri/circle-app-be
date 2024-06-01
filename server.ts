import express, { Request, Response } from "express";
import dotenv from "dotenv";
import Route from "./src/routes";
import path from "path";
import db from "./src/lib/db/index";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const corsConfig: object = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));

app.use("/api/v1/", Route);

app.listen(port, async () => {
  await db.$connect();
  console.log(`server listening on ${port}`);
});
