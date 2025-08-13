import { Request, Response } from "express";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { createDivisionService, deleteDivisionService, getAllDivisionService, getSingleDivisionService, updateDivisionService } from "./division.service";
import { IDivision } from "./division.interface";



// CREATE DIVISION
export const createDivision = catchAsync(async (req: Request, res: Response) => {
    const payload = { ...req.body, thumbnail: req.file?.path };
    const result = await createDivisionService(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Division created",
        data: result,
    });
});


// GET ALL DIVISION
export const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
    const result = await getAllDivisionService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
        meta: result.meta,
    });
});


// GET SINGLE DIVISION
export const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
    const slug = req.params.slug
    const result = await getSingleDivisionService(slug);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Divisions retrieved",
        data: result.data,
    });
});


// UPDATE DIVISION CONTROLLER
export const updateDivision = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload: IDivision = {
        ...req.body,
        thumbnail: req.file?.path
    }

    const result = await updateDivisionService(id, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division updated",
        data: result,
    });
});


// DELETE DIVISION CONTROLLER
export const deleteDivision = catchAsync(async (req: Request, res: Response) => {
    const result = await deleteDivisionService(req.params.id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Division deleted",
        data: result,
    });
});