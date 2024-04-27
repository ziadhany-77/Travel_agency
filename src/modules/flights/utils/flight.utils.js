import { v4 as uuidv4 } from "uuid";
export const generateSeatNum = () => {
  const rnd = uuidv4();
  const seatNumber = rnd.split("-")[1];
  return seatNumber;
};
