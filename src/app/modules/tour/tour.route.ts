import express from "express";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { createTourTypeZodSchema, createTourZodSchema, updateTourZodSchema } from "./tour.validation";
import { createTour, createTourType, deleteTour, deleteTourType, getAllTours, getAllTourTypes, updateTour, updateTourType } from "./tour.controller";
import { multerUpload } from "../../config/multer.config";


// TOUR ROUTES
export const tourRoutes = express.Router()

    // TOUR TYPE ROUTES
    .get("/tour-types", getAllTourTypes)
    .post("/create-tour-type", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), createTourType)
    .patch("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validateRequest(createTourTypeZodSchema), updateTourType)
    .delete("/tour-types/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), deleteTourType)


    // TOUR ROUTES
    .get("/", getAllTours)
    .post("/create", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.array("files"), validateRequest(createTourZodSchema), createTour)
    .patch("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), multerUpload.array("files"), validateRequest(updateTourZodSchema), updateTour)
    .delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), deleteTour)