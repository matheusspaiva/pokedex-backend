
import mongoose from "mongoose";

import CapturedPokemon from "./captured-pokemon.model";
import { CapturedPokemonDTO } from "./captured-pokemon.schema";

export class PokemonAlreadyCapturedError extends Error {
    constructor() {
        super("Este Pokémon já está na sua Pokédex!");
        this.name = "PokemonAlreadyCapturedError";
    }
}

export class CapturedPokemonNotFoundError extends Error {
    constructor() {
        super("Pokémon capturado não encontrado!");
        this.name = "CapturedPokemonNotFoundError";
    }
}

class CapturedPokemonService {


    async one(userId: string, pokemonId: number) {
        const capturedPokemon = await CapturedPokemon.find({
            userId: new mongoose.Types.ObjectId(userId),
            pokemonId: pokemonId,
            deletedAt: null
        })
            .select("pokemonId createdAt")
            .sort({ createdAt: -1 });

        if (!capturedPokemon) {
            throw new CapturedPokemonNotFoundError();
        }

        return capturedPokemon
    };

    async list(userId: string) {
        return CapturedPokemon.find({
            userId: new mongoose.Types.ObjectId(userId),
            deletedAt: null
        })
            .select("pokemonId createdAt")
            .sort({ createdAt: -1 });
    };

    async create(userId: string, data: CapturedPokemonDTO) {

        const ownerId = new mongoose.Types.ObjectId(userId);

        const existingPokemon = await CapturedPokemon.findOne({
            userId: ownerId,
            pokemonId: data.pokemonId
        });

        if (existingPokemon) {

            if (existingPokemon.deletedAt === null) {
                throw new PokemonAlreadyCapturedError();
            }

            existingPokemon.deletedAt = null;

            await existingPokemon.save();

            return existingPokemon;
        }

        try {
            return await CapturedPokemon.create({
                userId: ownerId,
                pokemonId: data.pokemonId,
                deletedAt: null
            });

        } catch (error: any) {
            if (error.code === 11000) {
                throw new PokemonAlreadyCapturedError();
            }

            throw error;
        }
    };

  
    async remove(userId: string, pokemonId: number) {
        const capturedPokemon = await CapturedPokemon.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            pokemonId,
            deletedAt: null
        });

        if (!capturedPokemon) {
            throw new CapturedPokemonNotFoundError();
        }

        capturedPokemon.deletedAt = new Date();

        await capturedPokemon.save();

        return {
            pokemonId: capturedPokemon.pokemonId,
            deletedAt: capturedPokemon.deletedAt
        };
    };

}

const capturedPokemonService = new CapturedPokemonService();

export default capturedPokemonService;
