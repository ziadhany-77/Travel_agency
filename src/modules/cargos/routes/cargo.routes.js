import { Router } from "express";
import {
  authenticate,
  authorize,
} from "../../authentication/middlewares/auth.middleware.js";
import { ROLES } from "../../../../utils/enums.js";
import {
  getAllCargos,
  getReceivedCargo,
  getSentCargos,
  sendCargo,
} from "../controllers/cargo.controller.js";

const router = Router();

router.route("/").get(authenticate, authorize(ROLES.ADMIN), getAllCargos);

router
  .route("/send")
  .get(authenticate, authorize(ROLES.USER), getSentCargos)
  .post(authenticate, authorize(ROLES.USER), sendCargo);

// router.route("/send/:cargoId").get(authenticate, authorize(ROLES.USER), getSentCargos);

router.route("/receive").get(authenticate, authorize(ROLES.USER), getReceivedCargo);
//   .post(authenticate, authorize(ROLES.USER), receiveCargo);
export default router;
