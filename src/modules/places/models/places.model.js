import mongoose from "mongoose";

const placesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "image",
    },
    type: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

placesSchema.pre(/find/i, function (next) {
  this.populate("coverImage");
  next();
});

const placesMoodel = mongoose.model("places", placesSchema);

export default placesMoodel;
