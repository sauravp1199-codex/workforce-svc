import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify) => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (app) => {
    await app.prisma.$disconnect();
  });
});

export function requireRole(allowed: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req.headers["x-user-id"] as string) || "";

    if (!userId) {
      return reply.status(401).send({ error: "Missing x-user-id header" });
    }

    const user = await (req.server as any).prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user || !user.isActive) {
      return reply.status(401).send({ error: "Invalid or inactive user" });
    }

    if (!allowed.includes(user.role.name)) {
      return reply.status(403).send({ error: "Forbidden: insufficient role" });
    }

    // attach user for handlers
    (req as any).user = { id: user.id, email: user.email, name: user.name, role: user.role.name };
  };
}