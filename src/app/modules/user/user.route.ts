import { Router } from "express";

import { validateRequest } from "../../middlewares/validateRequest";
import { checkAuth } from "../../middlewares/checkAuth";

import { Role } from "./user.interface";
import { createUser, getAllUsers, getMe, getSingleUser, updateUser } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";


// USER ROUTES
export const userRoutes = Router()
    .post("/register", validateRequest(createUserZodSchema), createUser)
    .get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getAllUsers)
    .get("/me", checkAuth(...Object.values(Role)), getMe)
    .get("/:id", checkAuth(...Object.values(Role)), getSingleUser)
    .patch("/:id", validateRequest(updateUserZodSchema), checkAuth(...Object.values(Role)), updateUser)