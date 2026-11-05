
import { z } from "zod";

export const capturedPokemonSchema = z.object({
    pokemonId: z
        .number()
        .int("O ID do Pokémon deve ser um número inteiro")
        .positive("O ID do Pokémon deve ser maior que zero")
});

export type CapturedPokemonDTO = z.infer<
    typeof capturedPokemonSchema
>;
