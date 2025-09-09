import { FastifyInstance } from "fastify";
import { requireRole } from "../plugins/prisma";

export async function adminRoutes(app: FastifyInstance) {
  app.get(
    "/admin/dashboard",
    { preHandler: [requireRole(["Admin", "GM"])] },
    async (req) => {
      const user = (req as any).user;
      return {
        message: `Welcome ${user.name}`,
        role: user.role,
        ts: new Date().toISOString(),
      };
    }
  );
}
