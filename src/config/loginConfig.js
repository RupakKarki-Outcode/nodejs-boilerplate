require("dotenv").config();


export const login = {
  jwtExpiration: process.env.JWT_EXPIRATION,
  jwtEncryption: process.env.JWT_ENCRYPTION
};

export const email = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS
  }
}
