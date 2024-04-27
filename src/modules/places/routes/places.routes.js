import { Router } from "express";
import validate from "../../../middlewares/validation.middleware.js";
import {
  authenticate,
  authorize,
} from "../../authentication/middlewares/auth.middleware.js";
import { ROLES } from "../../../../utils/enums.js";
import {
  addPlace,
  deletePlace,
  getAllPlaces,
  updatePlace,
} from "../controllers/places.controller.js";
import {
  addPlaceSchema,
  deletePlaceSchema,
  updatePlaceSchema,
} from "../validations/places.vlidations.js";
import { upload } from "../../../middlewares/upload.middleware.js";
import { attachImage } from "../../images/middlewares/image.middlewares.js";

const router = Router();

router
  .route("/")
  .get(getAllPlaces)
  .post(
    upload.single("coverImage"),
    validate(addPlaceSchema),
    authenticate,
    authorize(ROLES.ADMIN),
    attachImage("coverImage"),
    addPlace
  );

router
  .route("/:placeId")
  .delete(validate(deletePlaceSchema), authenticate, authorize(ROLES.ADMIN), deletePlace)
  .put(validate(updatePlaceSchema), authenticate, authorize(ROLES.ADMIN), updatePlace);

export default router;
