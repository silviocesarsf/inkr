import { NextFunction, Request, Response } from "express";
import { createUser, verifyUserToken, loginUser, getById } from "../service/user-service"
import { CreateUserInput } from "../type/create-user-type";
import { sendVerificationToken } from "../service/email-service"
import { Role } from "../generated/prisma";
import { HttpError } from "../middleware/http-error";

export const register = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
    try {
        const user = req.body;
        if (!user.name || !user.role || !user.email || !user.password) {
            throw new HttpError("Campos insuficientes.", 401);
        }

        if (user.role != Role.CLIENT && user.role != Role.ARTIST) {
            throw new HttpError("Tipo de cadastro inválido", 401);
        }

        const userCreated = await createUser(user);
        if (!userCreated?.user_id || !userCreated.token_verification) {
            throw new HttpError("Erro ao criar usuário", 500);
        }

        await sendVerificationToken(userCreated.token_verification, "silvio14dmc@gmail.com"); // TODO - Remover

        res.status(201).json({
            message: "Usuário criado com sucesso, verifique seu e-mail"
        });
    } catch (err) {
        next(err);
    }
}

export const verifyToken = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
    try {
        const { verification_token: verification_token } = req.body;
        if (!verification_token) {
            throw new HttpError("Token inválido", 401);
        }

        const userValidated = await verifyUserToken(verification_token);
        if (!userValidated) {
            throw new HttpError("Usuário não encontrado", 404);
        }

        res.status(200).json({
            success: true,
            message: "Usuário validado com sucesso."
        });
    } catch (err) {
        next(err);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, remember_me = false } = req.body;
        if (!email || !password) {
            throw new HttpError("Campos insuficientes.", 400);
        }

        const token = await loginUser(email, password, remember_me);
        if (!token) {
            throw new HttpError("Usuário ou senha inválidos.", 401);
        }

        res.status(200).json({ token });
    } catch (err) {
        next(err)
    }
}

export const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any)?.user?.userId || null;
        if (!userId) {
            throw new HttpError("Erro ao obter usuário", 500);
        }

        const user = await getById(userId);
        if (!user) {
            throw new HttpError("Usuário nao encontrado", 404);
        }

        res.status(200).json(user);
    } catch (err) {
        next(err)
    }
}