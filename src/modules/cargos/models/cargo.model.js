import mongoose from "mongoose";

const cargoSchema = new mongoose.Schema(
  {
    sourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "places",
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "places",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    breakable: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      minLength: 3,
      maxLength: 300,
      required: true,
    },
    received: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

cargoSchema.pre(/find/g, function (next) {
  this.populate("sender");
  next();
});

const cargoModel = mongoose.model("cargo", cargoSchema);

export default cargoModel;
