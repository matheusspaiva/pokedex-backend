
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./user.model";
import { CreateUserDTO, LoginDTO } from "./user.schema";
import crypto from 'node:crypto';

export class UserAlreadyExistsError extends Error {
    constructor() {
        super("Este e-mail já está cadastrado!");
        this.name = "UserAlreadyExistsError";
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super("E-mail ou senha inválidos!");
        this.name = "InvalidCredentialsError";
    }
}

class UserService {

    async create(data: CreateUserDTO) {
        const existingUser = await User.findOne({
            email: data.email
        });

        if (existingUser) {
            throw new UserAlreadyExistsError();
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        try {
            const user = await User.create({
                name: data.name,
                email: data.email,
                password: hashedPassword
            });

            return {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            };

        } catch (error: any) {
            if (error.code === 11000) {
                throw new UserAlreadyExistsError();
            }

            throw error;
        }
    }

    async login(data: LoginDTO) {
        const user = await User.findOne({
            email: data.email.toLowerCase()
        }).select("+password");

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const passwordMatches = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!passwordMatches) {
            throw new InvalidCredentialsError();
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET não configurado!");
        }

        const token = jwt.sign(
            {
                userId: user._id.toString()
            },
            secret,
            {
                expiresIn: "999d"
            }
        );

        return {
            token,
            user: {
                id: user._id,
                name: user.name,
                code: user.code,
                email: user.email
            }
        };
    }


    async getProfile(userId: string) {
        const user = await User.findById(userId).select("-password");

        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            code: user.code,
            createdAt: user.createdAt
        };
    }

    async getByCode(code: string) {
        const user = await User.findOne({ code }).select("-password");

        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        return {
            id: user._id,
            name: user.name,
            email: user.email,
            code: user.code,
            createdAt: user.createdAt
        };
    }

    async activeCode(userId: string, active: boolean) {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("Usuário não encontrado!");
        }

        user.code = active ? crypto.randomUUID() : null

        await user.save()

        return { code: user.code }
    }
}

const userService = new UserService();

export default userService;
