import { prisma } from '@/../lib/prisma';

export async function getUser(email: string): Promise<number | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
  
    if (!user) {
      return null;
    }
  
    return user.id;
}

export async function postUser(username: string, password: string, email: string): Promise<number | null> {
    const user = await prisma.user.create({
      data: {
        username: username,
        password: password,
        email: email
      }
    });
  
    return user.id;
}