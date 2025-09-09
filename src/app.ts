import Fastify from "fastify";
import prismaPlugin from "./plugins/prisma";
import securityPlugin from "./plugins/security";
import authPlugin from "./plugins/auth";
import { healthRoutes } from "./routes/health.route";
import { adminRoutes } from "./routes/admin.route";
import { authRoutes } from "./routes/auth.route";
import { usersRoutes } from "./routes/users.route";

export function buildApp() {
    const app = Fastify({
        logger: {
            level: "info",
            transport: process.env.NODE_ENV === "development"
                ? { target: "pino-pretty" }
                : undefined
        }
    });

    app.register(prismaPlugin);
    app.register(securityPlugin);
    app.register(authPlugin);

    app.register(healthRoutes, { prefix: "/v1" });
    app.register(authRoutes, { prefix: "/v1" });
    app.register(usersRoutes, { prefix: "/v1" });
    app.register(adminRoutes, { prefix: "/v1" });

    app.get("/", async () => ({ name: "workforce-svc", ok: true }));
    return app;
}
