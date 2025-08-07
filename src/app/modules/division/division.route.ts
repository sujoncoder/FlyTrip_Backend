import { Router } from "express";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { createDivision, deleteDivision, getAllDivisions, getSingleDivision, updateDivision } from "./division.controller";



// DIVISION ROUTES
export const divisionRoutes = Router()

    .post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createDivisionSchema), createDivision)

    .get("/", getAllDivisions)
    .get("/:slug", getSingleDivision)
    .patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(updateDivisionSchema), updateDivision)
    .delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), deleteDivision)