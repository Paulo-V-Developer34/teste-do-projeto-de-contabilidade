import bcrypt from "bcryptjs";
import { PrismaClient, Prisma } from "../src/generated/prisma";

const prisma = new PrismaClient();


export async function main() {
    //criptografando a senha
    const saltRound = 10
    const password = await bcrypt.hash("senha123@", saltRound)
    
    const userData: Prisma.UserCreateInput[] = [
      {
        name: "Alice",
        email: "alice@prisma.io",
        password: password,
        fatos: {
          create: [
            {
              title: "Comprei um carro",
              tipo: 111,
              value: -123,
              published: true,
            },
            {
              title: "vendi meu carro",
              tipo: 111,
              value: 123,
              published: true,
            }
          ],
        },
      },
      {
        name: "Jhon",
        email: "jhon@prisma.io",
        password: password,
        fatos: {
          create: [
            {
              title: "Comprei um carro",
              tipo: 111,
              value: -123,
              published: true,
            },
            {
              title: "vendi meu carro",
              tipo: 111,
              value: 123,
              published: true,
            }
          ],
        },
      }
    ];

  for (const u of userData) {
    await prisma.user.create({ data: u });
    console.log(`Usuario: ${u.name} foi criado`)
  }
}

main();