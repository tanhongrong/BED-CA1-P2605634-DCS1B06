import { Router, Router } from "express";
import { getUserById } from "../controllers/userController.js";

const router = Router()

//get user id
router.get("/:id",getUserById)

export default router