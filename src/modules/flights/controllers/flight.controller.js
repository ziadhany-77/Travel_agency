import { ApiFeatures } from "../../../../utils/ApiFeatures.js";
import { catchAsyncError } from "../../../../utils/Errorhandeling.js";
import flightModel from "../models/flight.model.js";
import stripe from "../../../../utils/onlinePayment.js";
import ticketModel from "../models/ticket.model.js";

export const getAllFlights = catchAsyncError(async (req, res) => {
  const apiFeatures = new ApiFeatures(flightModel.find(), req.query)
    .paginate()
    .search(["destination", "sourse"]);

  const flights = await apiFeatures.query;
  res.json({ flights });
});

export const getFlight = catchAsyncError(async (req, res) => {
  const flight = await flightModel.findById(req.params.flightId);
  res.json({ flight });
});

export const addFlight = catchAsyncError(async (req, res) => {
  const {
    sourse,
    destination,
    seats,
    takeOffTime,
    landingTime,
    price,
    discountedPrice,
    airline,
    coverImage,
  } = req.body;
  const validTakeOffTime = new Date(takeOffTime);
  const validLandingTime = new Date(landingTime);
  await flightModel.create({
    sourse,
    destination,
    seats,
    takeOffTime: validTakeOffTime,
    landingTime: validLandingTime,
    price,
    discountedPrice,
    airline,
    coverImage,
  });
  res.json({ message: "flight created" });
});

export const makeOnlinePayment = catchAsyncError(async (req, res) => {
  const ticket = await ticketModel.findOne(req.user.id);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "EGP",
          unit_amount: ticket.flightRef.discountedPrice * 100,
          product_data: {
            name: "Ticket cost",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "",
    cancel_url: "",
    client_reference_id: ticket._id,
    customer_email: req.user.email,
  });
  res.json({ session });
});
