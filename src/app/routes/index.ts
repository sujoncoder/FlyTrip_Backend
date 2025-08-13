import { Router } from "express";

import { otpRoutes } from "../modules/otp/otp.route";
import { tourRoutes } from "../modules/tour/tour.route";
import { userRoutes } from "../modules/user/user.route";
import { authRoutes } from "../modules/auth/auth.route";
import { statsRoutes } from "../modules/stats/stats.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { bookingRoutes } from "../modules/booking/booking.route";
import { divisionRoutes } from "../modules/division/division.route";


// DEFAULT ROUTE
export const router = Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: authRoutes
    },
    {
        path: "/division",
        route: divisionRoutes
    },
    {
        path: "/tour",
        route: tourRoutes
    },
    {
        path: "/booking",
        route: bookingRoutes
    },
    {
        path: "/payment",
        route: paymentRoutes
    },
    {
        path: "/otp",
        route: otpRoutes
    },
    {
        path: "/stats",
        route: statsRoutes
    },
];

// LOOP ALL ROUTE
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
});