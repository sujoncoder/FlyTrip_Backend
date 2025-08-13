import { Router } from "express";

import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";
import { createBooking, getAllBooking, getSingleBooking, getUserBookings, updateBookingStatus } from "./booking.controller";



export const bookingRoutes = Router()

    .post("/", checkAuth(...Object.values(Role)), validateRequest(createBookingZodSchema), createBooking)
    .get("/", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getAllBooking)
    .get("/my-bookings", checkAuth(...Object.values(Role)), getUserBookings)
    .get("/:bookingId", checkAuth(...Object.values(Role)), getSingleBooking)
    .patch("/:bookingId/status", checkAuth(...Object.values(Role)), validateRequest(updateBookingStatusZodSchema), updateBookingStatus)