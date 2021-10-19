import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.PlaceCreateInput[] = [
  {
    title: 'Urban Space 100',
    workingHours: "10:00-21:00",
    description: "Some text",
    tags: ["cafe", "closed"],
    state: "accepted",
  },
  {
    title: 'Промприлад',
    workingHours: "09:00-23:00",
    description: "Some test text",
    tags: ["cafe"],
    state: "accepted",
  },
  {
    title: 'Open Bookshelf',
    description: "Some texwed wefwef fwefwe fewewft",
    tags: ["bookshelf", "open"],
    state: "accepted",
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
      const user = await prisma.place.create({
        data: u,
      })
      console.log(`Created place with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
