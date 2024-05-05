import express from "express";
import AppError, { catchAsyncError } from "./utils/Errorhandeling.js";
import V1router from "./src/Routes/V1.routes.js";
import stripe from "stripe";
// import { sendTicketInfo } from "./src/modules/flights/controllers/flight.controller.js";

const bootstrap = (app) => {
  //express.raw take request without any modifcations
  app.post(
    "/webhook",
    express.raw({ type: "application/json" }),
    catchAsyncError(async (request, response) => {
      const sig = request.headers["stripe-signature"];

      let event;

      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          sig,
          process.env.ENDPOINT_SECRET
        );
      } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      // Handle the event
      switch (event.type) {
        case "checkout.session.completed":
          const checkoutData = event.data.object;
          await sendTicketInfo(checkoutData);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      response.send();
    })
  );

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
