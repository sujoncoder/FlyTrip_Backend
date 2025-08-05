/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction, RequestHandler } from "express";


// ASYNC-CATCH HANDER ===> ALTERNATIVE TO TRY CATCH BLOCK
export const catchAsync = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {

    Promise.resolve(fn(req, res, next)).catch((err: any) => {
        next(err);
    });
};