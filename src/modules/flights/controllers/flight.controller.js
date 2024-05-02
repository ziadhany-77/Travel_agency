import { ApiFeatures } from "../../../../utils/ApiFeatures.js";
import { catchAsyncError } from "../../../../utils/Errorhandeling.js";
import flightModel from "../models/flight.model.js";
import stripe from "../../../../utils/onlinePayment.js";
import ticketModel from "../models/ticket.model.js";
import userModel from "../../users/models/userModel.js";
import { generateSeatNum } from "../utils/flight.utils.js";
import transporter from "../../../../utils/mail.js";

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
  const { flightId } = req.params.flightId;

  const flight = await flightModel.findOne({ flightId });
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "EGP",
          unit_amount: flight.discountedPrice * 100,
          product_data: {
            name: "Ticket cost",
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url:
      "https://www.porsche.com/international/models/911/911-gt3-rs/911-gt3-rs/",
    cancel_url: "https://www.porsche.com/international/models/911/911-gt3-rs/911-gt3-rs/",
    client_reference_id: req.user.id,
    customer_email: req.user.email,
    metadata: {
      flightRef: JSON.stringify(flight._id),
    },
  });
  res.json({ session });
});

export const sendTicketInfo = async (data) => {
  const { customer_email, metadata } = data;
  const flightId = metadata.flightRef;
  const user = await userModel.findOne({ email: customer_email });
  const flight = await flightModel.findById({ flightId });
  const seatNumber = generateSeatNum();
  const ticket = await ticketModel.create({
    passenger: user._id,
    flightRef: metadata.flightRef,
    seatNumber,
    isPaid: true,
  });
  transporter.sendMail({
    from: process.env.EMAIL,
    to: customer_email,
    subject: "flight ticket",
    text: `hello ${user.firstName} your ticket to ${flight.destination.name} is booked
    succesfuly your seat is ${seatNumber} the flight will depature at ${flight.takeOffTime}
    please enjoy`,
  });
};
