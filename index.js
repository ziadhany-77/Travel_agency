import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import bootstrap from "./bootstrab.js";
import connectToDB from "./Database/DB_Connection.js";

const app = express();
dotenv.config();

const port = process.env.PORT;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectToDB();
bootstrap(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
