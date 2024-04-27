import { catchAsyncError } from "../../../../utils/Errorhandeling.js";
import userModel from "../models/userModel.js";

export const getAllUsers = catchAsyncError(async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});
