import fp from "fastify-plugin";
import fastifyHelmet from "@fastify/helmet";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { ENV } from "../config/env";

export default fp(async (app) => {
  await app.register(fastifyHelmet);
  await app.register(cors, {
    origin: ENV.CORS_ORIGINS.split(",").map(s => s.trim())
  });
  await app.register(rateLimit, {
    max: ENV.RATE_MAX_NUM,
    timeWindow: ENV.RATE_WINDOW_MS_NUM
  });
});
