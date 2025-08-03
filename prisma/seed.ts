import { prisma } from "../src/lib/prisma"

async function main() {
    await prisma.plan.createMany({
        data: [
            {
                name: "Grátis",
                price: 0,
                description: "15 dias de avaliação gratuita para artistas",
                plan_type: "ARTIST"
            },
            {
                name: "Pro",
                price: 49.9,
                description: "Perfil completo, agendamentos e galeria",
                plan_type: "ARTIST"
            },
            {
                name: "Grátis",
                price: 0,
                description: "Encontre os melhores tatuadores da sua região em alguns clicks",
                plan_type: "CLIENT"
            }
        ],
        skipDuplicates: true
    })
}

main().finally(() => prisma.$disconnect())