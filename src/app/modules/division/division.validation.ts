import { z } from "zod";


// CREATE DIVISION ZOD SCHEMA
export const createDivisionSchema = z.object({
    name: z.string().min(1),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
});


// UPDATE DIVISION ZOD SCHEMA
export const updateDivisionSchema = z.object({
    name: z.string().min(1).optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
});