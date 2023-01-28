import swaggerAutogen from "swagger-autogen";
import { ChangePasswordDef, LoginDef } from "./src/validators/authValidator";
import {
  CreateUserDef,
  ForgotPasswordDef,
  ResetPasswordDef,
  UpdateUserDef,
} from "./src/validators/userValidator";

const doc = {
  info: {
    version: "0.0.1",
    title: "My API",
    description: "API Documentation for Project",
  },
  "@definitions": {
    Login: LoginDef,
    ChangePassword: ChangePasswordDef,
    CreateUser: CreateUserDef,
    UpdateUser: UpdateUserDef,
    ForgotPassword: ForgotPasswordDef,
    ResetPassword: ResetPasswordDef,
  },
  host: "localhost:4005",
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/index"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc).then(
  async () => {
    await import("./src/index"); // Your project's root file
  }
);
