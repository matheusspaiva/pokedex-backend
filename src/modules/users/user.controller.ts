
import { Request, Response, NextFunction } from "express";
import { createUserSchema, loginSchema } from "./user.schema";
import userService, { UserAlreadyExistsError, InvalidCredentialsError } from "./user.service";
import { apiResponseCreated, apiResponseBadRequest, apiResponseConflict, apiResponseOK, apiResponseUnauthorized } from "../../utils/api-response";


class UserController {

    async create(req: Request, res: Response, next: NextFunction) {

        try {
            const validation = createUserSchema.safeParse(req.body);

            if (!validation.success) {
                return apiResponseBadRequest(
                    res,
                    validation.error.issues[0]?.message || "Dados inválidos!",
                    validation.error.issues
                );
            }

            const user = await userService.create(validation.data);

            return apiResponseCreated(res, "Usuário cadastrado com sucesso!", user);

        } catch (error) {

            if (error instanceof UserAlreadyExistsError) {
                return apiResponseConflict(res, error.message);
            }

            return next(error);
        }
    };

    async login(req: Request, res: Response, next: NextFunction) {

        try {
            const validation = loginSchema.safeParse(req.body);

            if (!validation.success) {
                return apiResponseBadRequest(
                    res,
                    validation.error.issues[0]?.message || "Dados inválidos!",
                    validation.error.issues
                );
            }

            const result = await userService.login(validation.data);

            return apiResponseOK(res, "Login realizado com sucesso!", result);

        } catch (error) {
            if (error instanceof InvalidCredentialsError) {
                return apiResponseUnauthorized(res, error.message);
            }

            return next(error);
        }
    };

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return apiResponseUnauthorized(res);
            }

            const user = await userService.getProfile(userId);

            return apiResponseOK(res, "Usuário encontrado com sucesso!", user);

        } catch (error) {
            return next(error);
        }
    }

    async activeCode(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return apiResponseUnauthorized(res);
            }

            const user = await userService.activeCode(userId, req.body.active);

            return apiResponseOK(res, "Codigo alterado!", user);


        } catch (error) {
            return next(error);
        }
    }

}

const userController = new UserController();

export default userController;
