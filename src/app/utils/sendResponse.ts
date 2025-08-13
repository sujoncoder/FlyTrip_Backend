import { Response } from "express";


// META
interface TMeta {
    page?: number;
    limit?: number;
    totalPage?: number;
    total: number;
};

interface TResponse<T> {
    statusCode: number;
    success: boolean;
    message: string;
    data: T;
    meta?: TMeta
};


// SEND RESPONSE UTILES FILE
export const sendResponse = <T>(res: Response, data: TResponse<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        statusCode: data.statusCode,
        message: data.message,
        meta: data.meta,
        data: data.data
    });
};