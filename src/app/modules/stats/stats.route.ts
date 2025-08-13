import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { getBookingStats, getPaymentStats, getTourStats, getUserStats } from "./stats.controller";


// STATS ROUTES
export const statsRoutes = Router()

    .get("/user", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getUserStats)
    .get("/tour", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getTourStats)
    .get("/booking", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getBookingStats)
    .get("/payment", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), getPaymentStats)