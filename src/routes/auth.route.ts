import { FastifyInstance } from "fastify";
import { z } from "zod";
import bcrypt from "bcryptjs";

export async function authRoutes(app: FastifyInstance) {
  app.post("/auth/login", async (req, reply) => {
    const Body = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    });

    const { email, password } = Body.parse(req.body);

    const user = await (app as any).prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });

    if (!user || !user.isActive) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email,
      role: user.role.name
    });

    return reply.send({
      access_token: token,
      token_type: "Bearer",
      expires_in: "configured"
    });
  });
}
