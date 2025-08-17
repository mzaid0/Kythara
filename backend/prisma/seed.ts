import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {

    const email = "superadmin@gmail.com"
    const password = "123456"
    const name = "super admin"

    const existingSuperAdmin = await prisma.user.findFirst({
        where: {
            role: "SUPER_ADMIN"
        }
    })

    if (existingSuperAdmin) {
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const superAdminUser = await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            role: "SUPER_ADMIN"
        }
    })

    console.log("Super admin created successfully", superAdminUser.email)

}

main().then(async () => {
    await prisma.$disconnect()
}).catch(e => console.log(e))