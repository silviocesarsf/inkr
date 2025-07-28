import { NextFunction, Request, Response } from "express";
import { createUser, verifyUserToken } from "../service/user-service"
import { CreateUserInput } from "../type/create-user-type";
import { sendVerificationToken } from "../service/email-service"

export const create = async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
    try {
        const user = req.body;
        if (!user.name || !user.role || !user.email || !user.password) {
            res.status(401).json({
                error: "Campos insuficientes."
            });
            return;
        }

        const userCreated = await createUser(user);
        if (!userCreated?.user_id || !userCreated.token_verification) {
            res.status(500).json({
                error: "Ocorreu um erro ao criar usuário."
            });
            return;
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
        const { verificationToken: verification_token } = req.body;
        if (!verification_token) {
            res.status(400).json({
                error: "Token não informado."
            });
            return;
        }

        const userValidated = await verifyUserToken(verification_token);
        if (!userValidated) {
            res.status(500).json({
                error: "Usuário não encontrado"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Usuário validado com sucesso."
        });
    } catch (err) {
        next(err);
    }
}