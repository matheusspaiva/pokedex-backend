import { Router } from "express";

import userController from "../modules/users/user.controller";
import capturedPokemonController from "../modules/captured-pokemon/captured-pokemon.controller";

const router = Router();


router.post("/users", userController.create);
router.get("/captured-pokemon-code", capturedPokemonController.listByUserCode);
router.post("/login", userController.login);


export default router;