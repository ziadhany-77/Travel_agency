import bcrybt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../../../../utils/mail.js";
import AppError, { catchAsyncError } from "../../../../utils/Errorhandeling.js";
import userModel from "../../users/models/userModel.js";

export const signUp = catchAsyncError(async (req, res) => {
  const { firstName, lastName, email, password, dateOfBirth, phoneNumber, role, gender } =
    req.body;

  const hashedPass = bcrybt.hashSync(password, +process.env.HASH_ROUNDS);

  const token = jwt.sign({ email }, process.env.EMAIL_SECRET);

  transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "Email verification",
    text: "Please validate you email address",
    html: `<a href="${req.protocol}://${req.headers.host}/auth/validate/${token}">Click here to confirm your email address</a>`,
  });
  await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPass,
    dateOfBirth,
    phoneNumber,
    role,
    gender,
  });

  res.status(201).json({ message: "signed up sucessfully" });
});

export const signIn = catchAsyncError(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user || !bcrybt.compareSync(password, user.password))
    throw new AppError("Wrong email or password");

  const { userName, role, _id: id } = user;
  const token = jwt.sign({ userName, role, id, email }, process.env.TOKEN_SECRET);
  res.json({ token });
});

export const validateEmail = catchAsyncError(async (req, res) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token);
    const { email } = decoded;
    await userModel.findOneAndUpdate({ email }, { isEmailVarified: true });
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    throw new AppError(error.message, 400);
  }
});
