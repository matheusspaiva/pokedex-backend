
import mongoose, { Schema, Document } from "mongoose";

export interface ICapturedPokemon extends Document {
    userId: mongoose.Types.ObjectId;
    pokemonId: number;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const CapturedPokemonSchema = new Schema<ICapturedPokemon>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        pokemonId: {
            type: Number,
            required: true
        },
        deletedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

CapturedPokemonSchema.index(
    {
        userId: 1,
        pokemonId: 1
    },
    {
        unique: true
    }
);

export default mongoose.model<ICapturedPokemon>(
    "CapturedPokemon",
    CapturedPokemonSchema
);
