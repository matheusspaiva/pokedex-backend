import { Router } from "express";

import publicRoutes from "./public.routes";
import privateRoutes from "./private.routes";

const router = Router();


router.use("/api", publicRoutes);
router.use("/api", privateRoutes);

export default router;