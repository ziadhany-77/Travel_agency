import { ApiFeatures } from "../../../../utils/ApiFeatures.js";
import { catchAsyncError } from "../../../../utils/Errorhandeling.js";
import placesMoodel from "../models/places.model.js";

export const getAllPlaces = catchAsyncError(async (req, res) => {
  const apiFeatures = new ApiFeatures(placesMoodel.find(), req.query).paginate(5);

  const places = await apiFeatures.query;
  res.json(places);
});

export const addPlace = catchAsyncError(async (req, res) => {
  const newPlace = await placesMoodel.create(req.body);
  res.status(201).json({ message: "place added sucessfully", newPlace });
});

export const deletePlace = catchAsyncError(async (req, res) => {
  await placesMoodel.findByIdAndDelete(req.params.placeId);
  res.json({ message: "place deleted sucessfully" });
});

export const updatePlace = catchAsyncError(async (req, res) => {
  const updatedPlace = await placesMoodel.findByIdAndUpdate(
    req.params.placeId,
    req.body,
    { new: true }
  );
  res.json({ message: "place updated", updatedPlace });
});
