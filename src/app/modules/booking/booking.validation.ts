import { z } from "zod";

import { BOOKING_STATUS } from "./booking.interface";


// CREATE BOOKING ZOD SCHEMA
export const createBookingZodSchema = z.object({
    tour: z.string(),
    guestCount: z.number().int().positive()
});


// UPDATE BOOKING STATUS SCHEMA
export const updateBookingStatusZodSchema = z.object({
    status: z.enum(Object.values(BOOKING_STATUS) as [string]),
});