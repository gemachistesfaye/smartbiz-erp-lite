import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const business = await prisma.business.create({
    data: {
      name: 'SmartBiz Demo',
      slug: 'smartbiz-demo',
      phone: '+251911234567',
      address: 'Addis Ababa, Ethiopia',
      currency: 'ETB',
    },
  });

  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.user.create({
    data: {
      businessId: business.id,
      email: 'owner@smartbiz.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'Owner',
      role: 'OWNER',
    },
  });

  await prisma.businessSettings.create({
    data: {
      businessId: business.id,
      taxRate: 15,
      currency: 'ETB',
      currencySymbol: 'Br',
      lowStockThreshold: 5,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
