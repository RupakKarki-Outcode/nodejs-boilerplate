import { Router } from "express";

import { userController } from "../controllers";
import { validateAuthUser } from "../middlewares/auth";
import {
  forgotPasswordValidator,
  resetPasswordValidator,
  userInsertValidator,
  userUpdateValidator,
} from "../validators/userValidator";

const router = Router();

/**
 * GET /api/users
 */
router.get("/", validateAuthUser, userController.fetchAll);

/**
 * GET /api/users/:id/verify-reset-token
 */
router.get("/:id/verify-reset-token", userController.verifyResetToken);

/**
 * POST /api/users/:id/reset-password
 */
router.post(
  "/:id/reset-password",
  resetPasswordValidator,
  userController.resetPassword
);

/**
 * GET /api/users/:id
 */
router.get("/:id", userController.show);

/**
 * POST /api/users
 */
router.post("/", userInsertValidator, userController.createUser);

/**
 * PUT /api/users/:id
 */
router.put("/:id", userUpdateValidator, userController.updateUser);

/**
 * POST /api/users/forgot-password
 */
router.post(
  "/forgot-password",
  forgotPasswordValidator,
  userController.forgotPassword
);

export default router;
