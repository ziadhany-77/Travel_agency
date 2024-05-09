import { ApiFeatures } from "../../../../utils/ApiFeatures.js";
import AppError, { catchAsyncError } from "../../../../utils/Errorhandeling.js";
import flightModel from "../models/flight.model.js";
import stripe from "../../../../utils/onlinePayment.js";
import ticketModel from "../models/ticket.model.js";
import userModel from "../../users/models/userModel.js";
import { generateSeatNum } from "../utils/flight.utils.js";
import transporter from "../../../../utils/mail.js";
import placesMoodel from "../../places/models/places.model.js";

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

// export const makeOnlinePayment = catchAsyncError(async (req, res) => {
//   const { flightId } = req.params.flightId;

//   const flight = await flightModel.findOne({ flightId });
//   const session = await stripe.checkout.sessions.create({
//     line_items: [
//       {
//         price_data: {
//           currency: "EGP",
//           unit_amount: flight.discountedPrice * 100,
//           product_data: {
//             name: "Ticket cost",
//           },
//         },
//         quantity: 1,
//       },
//     ],
//     mode: "payment",
//     success_url:
//       "https://www.porsche.com/international/models/911/911-gt3-rs/911-gt3-rs/",
//     cancel_url: "https://www.porsche.com/international/models/911/911-gt3-rs/911-gt3-rs/",
//     client_reference_id: req.user.id,
//     customer_email: req.user.email,
//     metadata: {
//       flightRef: JSON.stringify(flight._id),
//     },
//   });
//   res.json({ session });
// });

export const bookFlight = catchAsyncError(async (req, res) => {
  const { sourse, destination, takeOffTime, landingTime } = req.body;
  const from = await placesMoodel.findOne({ name: sourse });
  if (!from) throw new AppError("sourse location invalid");
  const to = await placesMoodel.findOne({ name: destination });
  if (!to) throw new AppError("sourse location invalid");
  const validTakeOffTime = new Date(takeOffTime);
  const validLandingTime = new Date(landingTime);

  const flight = await flightModel.findOne({
    sourse: from._id,
    destination: to._id,
    takeOffTime: { $gte: validTakeOffTime },
    landingTime: { $lte: validLandingTime },
  });
  if (!flight) throw new AppError("sorry, no flight matches your search");

  const seatNumber = generateSeatNum();
  const ticket = await ticketModel.create({
    passenger: req.user.id,
    flightRef: flight._id,
    seatNumber,
    isPaid: true,
  });
  await userModel.findByIdAndUpdate(req.user.id, { flights: flight._id });
  await flightModel.findByIdAndUpdate(flight._id, { $inc: { seats: -1 } });

  transporter.sendMail({
    from: process.env.EMAIL,
    to: req.user.email,
    subject: "flight ticket",
    text: `hello ${req.user.firstName} your ticket to ${flight.destination.name} is booked
    succesfuly your seat is ${seatNumber} the flight will depature at ${flight.takeOffTime}
    ticket referance ${ticket._id}
    please enjoy`,
  });
  res.json({ message: "booked" });
});

export const retriveTicket = catchAsyncError(async (req, res) => {
  const { ticketRef } = req.body;
  const ticket = await ticketModel.findById(ticketRef);
  await flightModel.findByIdAndUpdate(ticket.flightRef, { $inc: { seats: 1 } });
  await ticketModel.findByIdAndDelete(ticketRef);
  res.json({ message: "flight canceld" });
});
