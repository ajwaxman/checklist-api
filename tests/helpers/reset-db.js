import { prisma } from '../../app/database.js';

export const resetDb = async () => {
  await prisma.$transaction([
    prisma.group.deleteMany(),
    prisma.todo.deleteMany(),
    prisma.user.deleteMany(),
  ]);
};
