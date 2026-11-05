import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import userController from "../modules/users/user.controller";
import capturedPokemonController from "../modules/captured-pokemon/captured-pokemon.controller";

const router = Router();
router.use(authMiddleware);

router.get("/me", userController.me);

router.post("/active-code", userController.activeCode);



router.get("/captured-pokemon/:pokemonId", capturedPokemonController.one);

router.get("/captured-pokemon", capturedPokemonController.list);

router.post("/captured-pokemon", capturedPokemonController.create);

router.delete("/captured-pokemon/:pokemonId", capturedPokemonController.remove);

export default router;