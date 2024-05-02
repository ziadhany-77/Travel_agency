import mongoose from "mongoose";
import { GENDER, ROLES } from "../../../../utils/enums.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: [GENDER.MALE, GENDER.FEMALE],
      default: GENDER.MALE,
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      maxLength: 15,
      required: true,
    },
    role: {
      type: String,
      enum: [ROLES.USER, ROLES.ADMIN],
      default: ROLES.USER,
      required: true,
    },
    isEmailVarified: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    flights: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "flight",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual("name").get(function () {
  return this.firstName + " " + this.lastName;
});
userSchema.virtual("age").get(function () {
  const today = new Date();
  const birth = new Date(this.dateOfBirth);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  // If the birth month is after the current month or
  // if the birth month is the same as the current month
  // but the birth day is after the current day, subtract 1 from the age
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

userSchema.pre(/find/g, function (next) {
  this.populate("flights"), next();
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
