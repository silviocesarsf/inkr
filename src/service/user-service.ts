import { prisma } from "../lib/prisma";
import { CreateUserInput } from "../type/create-user-type";
import { formatDateToISO, hashPassword } from "../utils/utils";
import crypto from "crypto";
import { addDays } from "date-fns";
import bcrypt from "bcrypt";
import { HttpError } from "../middleware/http-error";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "";
export const createUser = async (user: CreateUserInput) => {
    const password = await hashPassword(user.password);
    const token = crypto.randomBytes(3).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    try {

        const trialPlanId = user.role == "ARTIST" ? 1 : 3; // Ids dos planos gratis
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
                },
                userPlans: {
                    create: {
                        plan_id: trialPlanId,
                        expires_at: addDays(new Date(), 15)
                    }
                }
            }
        })
    } catch (err) {
        throw err;
    }
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
            throw new HttpError("Token expirado, solicite outro.");
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
        throw err;
    }
}

export const loginUser = async (email: string, password: string, rememberMe: boolean): Promise<Object> => {
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                emails: {
                    some: {
                        address: email
                    }
                }
            }
        });

        const isValid = await bcrypt.compare(password, user.password) || false;
        if (!isValid) {
            throw new HttpError("Senha inválida.", 401);
        }

        if (!user.verified) {
            throw new HttpError("Verifique seu e-mail", 401);
        }

        const token = jwt.sign(
            { userId: user.user_id, role: user.role },
            SECRET,
            { expiresIn: rememberMe ? "1d" : "2h" }
        );

        return token;
    } catch (err) {
        throw err;
    }
}

export const getById = async (id: number) => {
    try {
        const user = await prisma.user.findFirst({
            select: {
                name: true,
                verified: true,
                role: true,
                created_at: true
            },
            where: {
                user_id: id
            }
        });

        if (!user) {
            throw new HttpError("Usuário nao encontrado", 404);
        }

        const formatedDate = formatDateToISO(user.created_at);
        (user as any).created_at = formatedDate;

        return user;
    } catch (err) {
        throw err;
    }
}