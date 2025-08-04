import { NextFunction, Request } from "express";
import { HttpError } from "./http-error";
import jwt from "jsonwebtoken"

export const auth = (req: any, res: any, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new HttpError("Token não fornecido", 401);
        }

        const [, token] = authHeader.split(" ");
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        (req as any).user = decoded;
        console.log("User decoded: ", decoded);
        next();
    } catch (err) {
        next(err)
    }
}