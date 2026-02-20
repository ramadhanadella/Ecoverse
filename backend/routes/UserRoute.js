import express from "express";
import { verifyUser, roleMiddleware } from "../middleware/AuthMiddleware.js";

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  countPekerja,
  getProfile,
  getWorkers,
} from "../controllers/Users.js";

const router = express.Router();

router.get(
  "/users",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getUsers,
);
router.get(
  "/users/count-pekerja",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  countPekerja,
);
router.get(
  "/profile",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getProfile,
);
router.get(
  "/pekerja",
  verifyUser,
  roleMiddleware(["admin", "visitor", "koor", "pekerja"]),
  getWorkers,
);

router.get("/users/:id", verifyUser, roleMiddleware(["admin"]), getUserById);
router.post("/users", verifyUser, roleMiddleware(["admin"]), createUser);
router.patch("/users/:id", verifyUser, roleMiddleware(["admin"]), updateUser);
router.delete("/users/:id", verifyUser, roleMiddleware(["admin"]), deleteUser);

export default router;
