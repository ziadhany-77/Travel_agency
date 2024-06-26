import { Router } from "express";
import {
  addFlight,
  bookFlight,
  getAllFlights,
  getFlight,
  retriveTicket,
} from "../controllers/flight.controller.js";
import { attachImage } from "../../images/middlewares/image.middlewares.js";
import {
  authenticate,
  authorize,
} from "../../authentication/middlewares/auth.middleware.js";
import { ROLES } from "../../../../utils/enums.js";
import { upload } from "../../../middlewares/upload.middleware.js";

const router = Router();

router.route("/").get(getAllFlights);

router
  .route("/create")
  .post(
    upload.single("coverImage"),
    authenticate,
    authorize(ROLES.ADMIN),
    attachImage("coverImage"),
    addFlight
  );

router.route("/book").post(authenticate, authorize(ROLES.USER), bookFlight);
router.route("/retrive").post(authenticate, authorize(ROLES.USER), retriveTicket);

router.route("/:flightId").get(authenticate, authorize(ROLES.USER), getFlight);

// router
//   .route("/:flightId/book")
//   .post(authenticate, authorize(ROLES.USER), makeOnlinePayment);

export default router;
