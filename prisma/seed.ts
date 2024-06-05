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

  await prisma.book.upsert({
    where: { key: 'testkey' },
    update: {},
    create: {
        key: 'testkey',
        title: 'Test Book',
        author: 'Test Author',
        isbn: 123456
    }
  })

  await prisma.book.upsert({
    where: { key: 'testkey2' },
    update: {},
    create: {
        key: 'testkey2',
        title: 'Test2 Book2',
        author: 'Test2 Author2',
        isbn: 12345
    }
  })

  await prisma.book.upsert({
    where: { key: 'testkey3' },
    update: {},
    create: {
        key: 'testkey3',
        title: 'Test3 Book3',
        author: 'Test3 Author3',
        isbn: 1234567
    }
  })

  await prisma.review.upsert({
    where: { id: 1},
    update: {},
    create: {
        userId: 1,
        bookId: 1,
        rating: 5,
        review: 'Great book!'
    }
  })

  await prisma.user_book.upsert({
    where: { id: 1},
    update: {},
    create: {
        userId: 1,
        bookId: 1,
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