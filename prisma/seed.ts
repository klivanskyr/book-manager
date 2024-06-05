import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
        username: 'Test User',
        password: '3L4xPE6v6vAZxJDoetu42PeDy2UF0X',
        email: 'test@test.com',
    }
  })

  await prisma.user.upsert({
    where: { email: 'test2@test2.com' },
    update: {},
    create: {
        username: 'Test2 User2',
        password: 'B4FYD3qnrOhiBnm0YJnlcJzmWG0Mar',
        email: 'test2@test2.com',
    }
  })
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })