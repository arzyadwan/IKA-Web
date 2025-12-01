// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const regions = [
    { name: 'Pusat (Makassar)', slug: 'makassar' },
    { name: 'IKA Jakarta', slug: 'jakarta' },
    { name: 'IKA Jogja', slug: 'jogja' },
    { name: 'IKA Semarang', slug: 'semarang' },
    { name: 'IKA Mesir', slug: 'mesir' },
  ]

  console.log('Start seeding...')
  for (const r of regions) {
    const region = await prisma.region.upsert({
      where: { slug: r.slug },
      update: {},
      create: r,
    })
    console.log(`Created region with id: ${region.id}`)
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })