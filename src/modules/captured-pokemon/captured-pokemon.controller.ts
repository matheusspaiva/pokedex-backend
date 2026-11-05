
import { Request, Response, NextFunction } from "express";

import { capturedPokemonSchema } from "./captured-pokemon.schema";

import capturedPokemonService, {
    PokemonAlreadyCapturedError,
    CapturedPokemonNotFoundError
} from "./captured-pokemon.service";

import {
    apiResponseOK,
    apiResponseCreated,
    apiResponseBadRequest,
    apiResponseConflict,
    apiResponseNotFound,
    apiResponseUnauthorized
} from "../../utils/api-response";
import userService, { UserAlreadyExistsError } from "../users/user.service";

class CapturedPokemonController {


    async one(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return apiResponseUnauthorized(res);
            }

            const pokemonId = Number(req.params.pokemonId);

            if (
                !Number.isInteger(pokemonId) ||
                pokemonId <= 0
            ) {
                return apiResponseBadRequest(
                    res,
                    "ID do Pokémon inválido!"
                );
            }

            const capturedPokemon = await capturedPokemonService.one(userId, pokemonId);

            return apiResponseOK(
                res,
                "Pokémon capturados encontrados com sucesso!",
                capturedPokemon
            );

        } catch (error) {

            if (error instanceof CapturedPokemonNotFoundError) {
                return apiResponseNotFound(res, error.message);
            }

            return next(error);
        }
    }

    async list(req: Request, res: Response, next: NextFunction) {

        try {
            const userId = req.user?.userId;

            if (!userId) {
                return apiResponseUnauthorized(res);
            }

            const capturedPokemon =
                await capturedPokemonService.list(userId);

            return apiResponseOK(
                res,
                "Pokémon capturados encontrados com sucesso!",
                capturedPokemon
            );

        } catch (error) {
            return next(error);
        }
    };


    async listByUserCode(req: Request, res: Response, next: NextFunction) {
        try {
            const code = req.query.code;

            const user = await userService.getByCode(String(code))

            const capturedPokemon =
                await capturedPokemonService.list(user.id.toString());

            return apiResponseOK(
                res,
                "Pokémon capturados encontrados com sucesso!",
                capturedPokemon
            );

        } catch (error) {


            return next(error);
        }
    };

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return apiResponseUnauthorized(res);
            }

            const validation = capturedPokemonSchema.safeParse(req.body);

            if (!validation.success) {
                return apiResponseBadRequest(
                    res,
                    validation.error.issues[0]?.message ||
                    "Dados inválidos!",
                    validation.error.issues
                );
            }

            const capturedPokemon =
                await capturedPokemonService.create(
                    userId,
                    validation.data
                );

            return apiResponseCreated(
                res,
                "Pokémon adicionado à sua Pokédex!",
                capturedPokemon
            );

        } catch (error) {
            if (error instanceof PokemonAlreadyCapturedError) {
                return apiResponseConflict(res, error.message);
            }

            return next(error);
        }
    };

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                return apiResponseUnauthorized(res);
            }

            const pokemonId = Number(req.params.pokemonId);

            if (!Number.isInteger(pokemonId) || pokemonId <= 0) {
                return apiResponseBadRequest(
                    res,
                    "ID do Pokémon inválido!"
                );
            }

            const result = await capturedPokemonService.remove(
                userId,
                pokemonId
            );

            return apiResponseOK(
                res,
                "Pokémon removido da sua Pokédex!",
                result
            );

        } catch (error) {
            if (error instanceof CapturedPokemonNotFoundError) {
                return apiResponseNotFound(res, error.message);
            }

            return next(error);
        }
    };

}

const capturedPokemonController = new CapturedPokemonController();

export default capturedPokemonController;
