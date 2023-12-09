import {PrismaClient} from '@prisma/client';
import {getBranchSeed} from './seeds/branch.seed';

const prisma = new PrismaClient();

const load = async () => {
  try {
    console.log('Making sure data not exists.');
    await prisma.user.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.branch.deleteMany();

    console.log('Inserting seed records.');
    await prisma.branch.create(await getBranchSeed());

    console.log('Seeds inserted successfully.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
