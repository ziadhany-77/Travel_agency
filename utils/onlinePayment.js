import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SK);

export default stripe;
