import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";


// VALIDATE REQUEST MIDDLEWARE
export const validateRequest = (zodSchema: ZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // FOR MULTER PART
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        };

        req.body = await zodSchema.parseAsync(req.body);
        next();
    } catch (error) {
        next(error);
    };
};