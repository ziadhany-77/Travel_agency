import { Router } from "express";
import { signIn, signUp, validateEmail } from "../controllers/auth.controller.js";
import { assertUniqueEmail } from "../middlewares/auth.middleware.js";
import { signinSchema, signupSchema } from "../validation/auth.validatio.js";
import validate from "../../../middlewares/validation.middleware.js";

const router = Router();

router.post("/signin", validate(signinSchema), signIn);
router.post("/signup", validate(signupSchema), assertUniqueEmail, signUp);
router.get("/validate/:token", validateEmail);

export default router;
