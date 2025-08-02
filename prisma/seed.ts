import { prisma } from "../src/lib/prisma"

async function main() {
    console.log("SEED");
    await prisma.plan.createMany({
        data: [
            {
                name: "Trial",
                price: 0,
                description: "Experimente 15 dias de acesso gratuito a nossa plataforma"
            }
        ],
        skipDuplicates: true
    })
}

main().finally(() => prisma.$disconnect())
