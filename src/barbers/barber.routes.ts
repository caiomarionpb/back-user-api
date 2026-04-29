import { Router } from "express";
import * as barberController from "./barber.controller";

const router = Router();

router.get("/", barberController.getBarbers);

export default router;
