import { Role } from "../generated/prisma";

export type CreateUserInput = {
  name: string;
  password: string;
  role: Role;
  email: string;
  verification_token?: string
};