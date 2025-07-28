import { prisma } from "../lib/prisma";
import { errorHandler } from "../middleware/error-handler";
import { CreateUserInput } from "../type/create-user-type";
import { hashPassword } from "../utils/utils";
import crypto from "crypto";

export const createUser = async (user: CreateUserInput) => {
    const password = await hashPassword(user.password);
    const token = crypto.randomBytes(3).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    return await prisma.user.create({
        data: {
            name: user.name,
            password,
            role: user.role,
            token_verification: token,
            token_expires_at: expiresAt,
            emails: {
                create: {
                    address: user.email
                }
            }
        }
    })
}

export const verifyUserToken = async (verificationToken: string) => {
    try {
        if (!verificationToken) {
            throw new Error("Token não informado.");
        }

        const user = await prisma.user.findFirst({
            where: {
                token_verification: verificationToken
            }
        });

        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        if (user.token_expires_at && user.token_expires_at < new Date()) {
            throw new Error("Token expirado, solicite outro");
        }

        await prisma.user.update({
            where: { user_id: user.user_id },
            data: {
                verified: true,
                token_verification: null,
                token_expires_at: null
            }
        });

        return true;
    } catch (err) {
        console.error(err);
    }
}