/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { handleCastError } from "../helpers/handleCastError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerZodError } from "../helpers/handlerZodError";
import { TErrorSources } from "../interfaces/error.types";
import { SECRET } from "../config/env";
import { ApiError } from "../errors/ApiError";
import { deleteImageFromCLoudinary } from "../config/cloudinary.config";



// GLOBAL ERROR HANDLER MIDDLEWARE
export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (SECRET.NODE_ENV === "development") {
        console.log(err);
    };

    // CLOUDINARY SINGLE IMAGE DESTROY
    if (req.file) {
        await deleteImageFromCLoudinary(req.file.path)
    };

    // CLOUDINARY MULTIPLE IMAGES DESTROY
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const imageUrls = (req.files as Express.Multer.File[]).map(file => file.path)

        await Promise.all(imageUrls.map(url => deleteImageFromCLoudinary(url)))
    };


    let errorSources: TErrorSources[] = []
    let statusCode = 500
    let message = "Something Went Wrong!!"


    if (err.code === 11000) {
        const simplifiedError = handlerDuplicateError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }

    else if (err.name === "CastError") {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message
    }

    else if (err.name === "ZodError") {
        const simplifiedError = handlerZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }

    else if (err.name === "ValidationError") {
        const simplifiedError = handlerValidationError(err)
        statusCode = simplifiedError.statusCode;
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
    }

    else if (err instanceof ApiError) {
        statusCode = err.statusCode
        message = err.message
    }

    else if (err instanceof Error) {
        statusCode = 500;
        message = err.message
    };

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: SECRET.NODE_ENV === "development" ? err : null,
        stack: SECRET.NODE_ENV === "development" ? err.stack : null
    });
};