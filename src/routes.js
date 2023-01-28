import { Router } from "express";

import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

/**
 * Contains all API routes for the application.
 */
const router = Router();

/**
 * GET /api
 */
router.get("/", (req, res) => {
  res.json({
    app: req.app.locals.title,
    apiVersion: req.app.locals.version,
  });
});

/**
 * GET /api/health
 */
router.get("/health-check", (req, res) => {
  const healthcheck = {
    message: "OK",
  };
  try {
    res.send(healthcheck);
  } catch (e) {
    healthcheck.message = e;
    res.status(503).send();
  }
});

router.use("/users", userRoutes);
router.use("/auth", authRoutes);

export default router;
