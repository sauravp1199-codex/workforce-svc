// src/routes/health.route.ts
import { FastifyInstance } from "fastify";

export async function healthRoutes(app: FastifyInstance) {
    app.get("/health", async (_req, reply) => {
        try {
            // DB ping
            await app.prisma.$queryRawUnsafe("SELECT 1");

            // Is PostGIS actually installed?
            const rows = await app.prisma.$queryRawUnsafe<{ exists: boolean }[]>(
                "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') AS exists"
            );

            const postgis = rows[0]?.exists ? "available" : "not_available";

            return {
                status: "ok",
                db: "connected",
                postgis,
                ts: new Date().toISOString()
            };
        } catch (e) {
            return reply.code(503).send({
                status: "not_ok",
                db: "error",
                postgis: "unknown",
                ts: new Date().toISOString()
            });
        }
    });
}
