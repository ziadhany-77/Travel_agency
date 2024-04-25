import mongoose from "mongoose";

const connectToDB = () => {
  mongoose
    .connect(process.env.DATABASE_CONNECTION)
    .then(() => console.log("database connection established"))
    .catch(() => console.log("database connection failed"));
};

export default connectToDB;
