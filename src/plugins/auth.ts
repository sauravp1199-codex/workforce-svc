import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { ENV } from "../config/env";
import { FastifyReply, FastifyRequest } from "fastify";

// We rely on prisma plugin already registered (fastify.prisma)

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: string; email: string; role: string };
    user: { sub: string; email: string; role: string };
  }
}

export default fp(async (app) => {
  await app.register(jwt, {
    secret: ENV.JWT_SECRET,
    sign: { expiresIn: ENV.JWT_EXPIRES_IN }
  });

  app.decorate("authenticate", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
      // Optional: ensure user still exists & active
      const user = await (app as any).prisma.user.findUnique({
        where: { id: req.user.sub },
        include: { role: true }
      });
      if (!user || !user.isActive) {
        return reply.code(401).send({ error: "User inactive or missing" });
      }
      // Keep token role authoritative but refresh from DB too
      (req as any).userEntity = {
        id: user.id, email: user.email, name: user.name, role: user.role.name
      };
    } catch (err) {
      return reply.code(401).send({ error: "Invalid or missing token" });
    }
  });

  app.decorate("requireRole", (allowed: string[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      // authenticate must run before this
      const u = (req as any).userEntity as { role: string } | undefined;
      if (!u || !allowed.includes(u.role)) {
        return reply.code(403).send({ error: "Forbidden: insufficient role" });
      }
    };
  });
});

// Type augmentation for Fastify instance decorators
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (roles: string[]) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
