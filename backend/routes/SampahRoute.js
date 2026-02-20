import express from "express";
import { verifyUser, roleMiddleware } from "../middleware/AuthMiddleware.js";

import {
  getSampah,
  getSampahById,
  createSampah,
  updateSampah,
  deleteSampah,
} from "../controllers/Sampah.js";

const router = express.Router();

router.get("/Sampah", verifyUser, roleMiddleware(["admin"]), getSampah);
router.get("/Sampah/:id", verifyUser, roleMiddleware(["admin"]), getSampahById);
router.post("/Sampah", verifyUser, roleMiddleware(["admin"]), createSampah);
router.patch(
  "/Sampah/:id",
  verifyUser,
  roleMiddleware(["admin"]),
  updateSampah
);
router.delete(
  "/Sampah/:id",
  verifyUser,
  roleMiddleware(["admin"]),
  deleteSampah
);

export default router;
