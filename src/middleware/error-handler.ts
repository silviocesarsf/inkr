import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err.name === "PrismaClientKnownRequestError") {
        if (err.code === "P2002") {
            return res.status(409).json({ error: "Registro duplicado" });
        }

        if (err.code === "P2025") {
            return res.status(404).json({ error: "Registro não encontrado" });
        }

        return res.status(400).json({ error: `Erro: ${err.code}` });
    }

    if (err.name === "ZodError") {
        return res.status(422).json({ error: "Dados inválidos", details: err.errors });
    }

    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }

    return res.status(500).json({ error: "Erro interno do servidor" });
}
