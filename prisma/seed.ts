import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const roleNames = ["Worker", "Supervisor", "PM", "HR", "Finance", "GM", "Admin"];
    await Promise.all(
        roleNames.map(name =>
            prisma.role.upsert({ where: { name }, update: {}, create: { name } })
        )
    );

    const adminRole = await prisma.role.findUnique({ where: { name: "Admin" } });
    if (!adminRole) throw new Error("Admin role missing");

    const hash = await bcrypt.hash("admin123", 10);

    await prisma.user.upsert({
        where: { email: "saurav@gmail.com" },
        update: { password: hash, isActive: true, roleId: adminRole.id },
        create: {
            email: "saurav@gmail.com",
            password: hash,
            name: "Admin User",
            isActive: true,
            roleId: adminRole.id
        }
    });

    console.log("✅ Seeded roles and admin (email: saurav@gmail.com / password: admin123)");
}

main().finally(() => prisma.$disconnect());
