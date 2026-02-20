import express from "express";
import { verifyUser, roleMiddleware } from "../middleware/AuthMiddleware.js";
import {
  getSetor,
  getSetorById,
  createSetor,
  updateSetor,
  deleteSetor,
  getMonthlySummary,
  getTotalSampah,
  getSummaryByMonth,
  getDataRW,
  getDataRWMonthly,
} from "../controllers/Setor.js";

const router = express.Router();

router.get(
  "/setor",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getSetor,
);
router.get(
  "/setor/summary-by-month",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getSummaryByMonth,
);
router.get(
  "/setor/summary-monthly",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getMonthlySummary,
);
router.get(
  "/setor/data-rw",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getDataRW,
);
router.get(
  "/setor/data-rw-monthly",
  verifyUser,
  roleMiddleware(["admin", "koor", "pekerja", "visitor"]),
  getDataRWMonthly,
);
router.get(
  "/setor/total-sampah",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getTotalSampah,
);
router.get(
  "/setor/:id",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getSetorById,
);
router.post(
  "/setor",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  createSetor,
);
router.patch(
  "/setor/:id",
  verifyUser,
  roleMiddleware(["admin", "koor", "pekerja"]),
  updateSetor,
);
router.delete(
  "/setor/:id",
  verifyUser,
  roleMiddleware(["admin", "koor", "pekerja"]),
  deleteSetor,
);

export default router;
