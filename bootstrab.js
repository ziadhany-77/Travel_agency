import express from "express";
import AppError from "./utils/Errorhandeling.js";
import V1router from "./src/Routes/V1.routes.js";

const bootstrap = (app) => {
  app.use(express.json());

  app.use("/api/V1", V1router);

  app.all("*", (req, res, next) => {
    throw new AppError("Route Not Found");
  });

  app.use((error, req, res, next) => {
    const { message, statusCode, stack } = error;
    res.status(statusCode || 500).json({
      message,
      ...(process.env.MODE === "development" && { stack }),
    });
  });
};

export default bootstrap;
