import { FastifyInstance } from "fastify";

export async function usersRoutes(app: FastifyInstance) {
    // Any authenticated user can see their own profile
    app.get("/users/me", { preHandler: [app.authenticate] }, async (req) => {
        // attached in authenticate
        const me = (req as any).userEntity;
        return me;
    });

    // Only Admin/GM can list users
    app.get("/users", { preHandler: [app.authenticate, app.requireRole(["Admin", "GM"])] }, async (req) => {
        const users = await (app as any).prisma.user.findMany({
            select: { id: true, email: true, name: true, isActive: true, role: { select: { name: true } } },
            orderBy: { createdAt: "desc" }
        });
        return users.map((u: { role: { name: any; }; }) => ({ ...u, role: u.role.name }));
    });
}
