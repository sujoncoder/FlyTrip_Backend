import { Request, Response } from 'express';

import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

import { ITour } from './tour.interface';
import { createTourService, createTourTypeService, deleteTourService, deleteTourTypeService, getAllTourService, getAllTourTypeService, updateTourService, updateTourTypeService } from './tour.service';




// CREATE NEW TOUR CONTROLLER
export const createTour = catchAsync(async (req: Request, res: Response) => {
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    };

    const result = await createTourService(payload);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
});


// GET ALL TOURS CONTROLLER
export const getAllTours = catchAsync(async (req: Request, res: Response) => {

    const query = req.query
    const result = await getAllTourService(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tours retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});


// UPDATE TOUR CONTROLLER
export const updateTour = catchAsync(async (req: Request, res: Response) => {
    const payload: ITour = {
        ...req.body,
        images: (req.files as Express.Multer.File[]).map(file => file.path)
    };

    const result = await updateTourService(req.params.id, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });
});


// DELETE TOUR CONTROLLER
export const deleteTour = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteTourService(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
});


// GET ALL TOUR TYPES CONTROLLER
export const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await getAllTourTypeService();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
});


// CREATE TOUR TYPE CONTROLLER
export const createTourType = catchAsync(async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await createTourTypeService({ name });
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });
});


// UPDATE TOUR TYPE CONTROLLER
export const updateTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await updateTourTypeService(id, name);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
});


// DELETE TOUR TYPE CONTROLLER
export const deleteTourType = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await deleteTourTypeService(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
});;