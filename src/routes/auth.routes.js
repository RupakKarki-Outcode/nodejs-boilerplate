import { Router } from "express";

import { userController } from "../controllers";

import { validateAuthUser } from "../middlewares/auth";
import {
  authLoginValidator,
  changePasswordValidator,
} from "../validators/authValidator";

const router = Router();

/**
 * GET /api/auth/user
 */
router.get("/user", validateAuthUser, userController.getAuthDetail);

/**
 * POST /api/auth/login
 */
router.post("/login", authLoginValidator, userController.authLogin);

/**
 * POST /api/auth/:id
 */
router.post(
  "/change-password",
  validateAuthUser,
  changePasswordValidator,
  userController.changePassword
);

export default router;
