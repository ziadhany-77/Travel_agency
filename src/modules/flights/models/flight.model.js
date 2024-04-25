import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
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
    seats: {
      type: Number,
      min: 0,
      required: true,
    },
    takeOffTime: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    landingTime: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    price: {
      type: Number,
      min: 0.01,
      required: true,
    },
    discountedPrice: {
      type: Number,
      min: 0.01,
      required: true,
      validate: {
        validator: function (discounted) {
          return discounted <= this.price;
        },
        message: "the discounted price can not exceed the actual price",
      },
    },
    airline: {
      type: String,
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "image",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

flightSchema.pre(/find/i, function (next) {
  this.populate("coverImage");
  this.populate("sourse");
  this.populate("destination");
  next();
});

flightSchema.pre(/delete/i, async function (next) {
  const flightToBeDeleted = flightModel.findOne(this._conditions);
  if (!flightToBeDeleted) return next();
  await mongoose.model("image").findByIdAndDelete(flightToBeDeleted.coverImage);
  next();
});
const flightModel = mongoose.model("flight", flightSchema);

export default flightModel;
