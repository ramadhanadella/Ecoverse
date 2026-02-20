import express from "express";
import { verifyUser, roleMiddleware } from "../middleware/AuthMiddleware.js";
import {
  getLaporanSummary,
  getLaporanSetoran,
} from "../controllers/Laporan.js";

const router = express.Router();

router.get(
  "/laporan/summary",
  verifyUser,
  roleMiddleware(["admin", "visitor"]),
  getLaporanSummary
);
router.get(
  "/laporan/setoran",
  verifyUser,
  roleMiddleware(["admin", "visitor"]),
  getLaporanSetoran
);

export default router;
