import express from "express";
import { verifyUser, roleMiddleware } from "../middleware/AuthMiddleware.js";

import {
  getRW,
  getRWById,
  createRW,
  updateRW,
  deleteRW,
} from "../controllers/Rw.js";

const router = express.Router();

router.get("/RW", verifyUser, roleMiddleware(["admin"]), getRW);
router.get("/RW/:id", verifyUser, roleMiddleware(["admin"]), getRWById);
router.post("/RW", verifyUser, roleMiddleware(["admin"]), createRW);
router.patch("/RW/:id", verifyUser, roleMiddleware(["admin"]), updateRW);
router.delete("/RW/:id", verifyUser, roleMiddleware(["admin"]), deleteRW);

export default router;
