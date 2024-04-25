import { ApiFeatures } from "../../../../utils/ApiFeatures.js";
import { catchAsyncError } from "../../../../utils/Errorhandeling.js";
import cargoModel from "../models/cargo.model.js";

export const getAllCargos = catchAsyncError(async (req, res) => {
  const apiFeatures = new ApiFeatures(cargoModel.find(), req.query).paginate(10);
  const cargos = await apiFeatures.query;
  res.json(cargos);
});

export const getSentCargos = catchAsyncError(async (req, res) => {
  const apiFeatures = new ApiFeatures(
    cargoModel.find({ sender: req.user.id }),
    req.query
  ).paginate(10);
  const sentCargos = await apiFeatures.query;
  res.json(sentCargos);
});

export const sendCargo = catchAsyncError(async (req, res) => {
  const { from, to, description, breakable } = req.body;
  const { id } = req.user;
  const cargo = await cargoModel.create({
    sourse: from,
    destination: to,
    sender: id,
    breakable,
    description,
  });
  res.json({ message: "shipment will be sent soon" }, cargo);
});

export const getReceivedCargo = catchAsyncError(async (req, res) => {
  const { cargoReference } = req.body;
  const cargo = await cargoModel.findOne({ _id: cargoReference });
  res.json(cargo);
});
