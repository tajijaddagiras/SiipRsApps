import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@rsesaunggul.com' },
        update: {},
        create: {
            email: 'admin@rsesaunggul.com',
            password: hashedPassword,
            name: 'Dr. Admin SIIP',
            avatar: 'https://ui-avatars.com/api/?name=Admin+SIIP&background=4285F4&color=fff',
        },
    });

    console.log({ admin });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
