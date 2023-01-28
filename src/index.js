import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import "./env";
import * as errorHandler from "./middlewares/errorHandler";
import json from "./middlewares/json";
import routes from "./routes";
import logger, { logStream } from "./utils/logger";

import swaggerUi from "swagger-ui-express";
const swaggerFile = require("../swagger-output.json");

// Passport Config
import passport from "passport";
require("./config/passport")(passport);

const app = express();

const APP_PORT =
  (process.env.NODE_ENV === "test"
    ? process.env.TEST_APP_PORT
    : process.env.APP_PORT) ||
  process.env.PORT ||
  "3000";

const APP_HOST = process.env.APP_HOST || "0.0.0.0";

app.set("port", APP_PORT);
app.set("host", APP_HOST);

app.locals.title = process.env.APP_NAME;
app.locals.version = process.env.APP_VERSION;

app.use(cors());
app.use(helmet());
app.use(morgan("tiny", { stream: logStream }));
app.use(express.json());
app.use(errorHandler.bodyParser);
app.use(json);

// API Routes
app.use("/api", routes);

//
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error Middleware
app.use(errorHandler.genericErrorHandler);
app.use(errorHandler.methodNotAllowed);

app.listen(app.get("port"), app.get("host"), () => {
  logger.info(
    `Server started at http://${app.get("host")}:${app.get("port")}/api`
  );
});

// Catch unhandled rejections
process.on("unhandledRejection", (err) => {
  logger.error("Unhandled rejection", err);
  process.exit(1);
});

// Catch uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", err);
  process.exit(1);
});

export default app;
