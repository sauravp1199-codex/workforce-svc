import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  CORS_ORIGINS: z.string().default("http://localhost:5173"),
  RATE_MAX: z.coerce.number().default(100),
  RATE_WINDOW_MS: z.coerce.number().default(60000),
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default("1h")
});

const env = EnvSchema.parse(process.env);

export const ENV = {
  ...env,
  PORT_NUM: env.PORT,
  RATE_MAX_NUM: env.RATE_MAX,
  RATE_WINDOW_MS_NUM: env.RATE_WINDOW_MS
};
