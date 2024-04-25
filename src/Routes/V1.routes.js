import { Router } from "express";
import authRouter from "../modules/authentication/routes/auth.routes.js";
import flightRouter from "../modules/flights/routes/flight.routes.js";
import placesRouter from "../modules/places/routes/places.routes.js";
import cargoRouter from "../modules/cargos/routes/cargo.routes.js";

const V1router = Router();

V1router.use("/auth", authRouter);
V1router.use("/cargo", cargoRouter);
V1router.use("/places", placesRouter);
V1router.use("/flights", flightRouter);

export default V1router;
