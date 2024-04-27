import mongoose from "mongoose";
import { CLASS } from "../../../../utils/enums.js";

const ticketSchema = new mongoose.Schema(
  {
    // class: {
    //   type: String,
    //   enum: [CLASS.ECONOMY, CLASS.PREMIUM_ECONOMY, CLASS.BUSINESS, CLASS.PREMIUM_ECONOMY],
    //   required: true,
    // },
    seatNumber: {
      type: String,
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    flightRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "flight",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ticketSchema.pre(/find/i, function (next) {
  this.populate("passenger");
  this.populate("flightRef", ["-seats"]);
  next();
});
const ticketModel = mongoose.model("ticket", ticketSchema);

export default ticketModel;
