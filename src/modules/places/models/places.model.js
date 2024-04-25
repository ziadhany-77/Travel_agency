import mongoose from "mongoose";

const placesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
    },
    type: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const placesMoodel = mongoose.model("places", placesSchema);

export default placesMoodel;
