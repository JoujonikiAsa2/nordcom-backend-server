import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
    refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    reset_pass_secret: process.env.JWT_RESET_PASS_TOKEN,
    reset_pass_token_expires_in: process.env.JWT_RESET_PASS_TOKEN_EXPIRES_IN,
  },
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  nodemailer_email: process.env.NODEMAILER_EMAIL,
  nodemailer_password: process.env.NODEMAILER_PASSWORD,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};
