import { QueryBuilder } from "../../utils/QueryBuilder";

import { Tour, TourType } from "./tour.model";
import { ITour, ITourType } from "./tour.interface";
import { tourSearchableFields } from "./tour.constant";



// CREATE NEW TOUR SERVICE 
export const createTourService = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    };

    const tour = await Tour.create(payload);
    return tour;
};


// GET ALL TOURS SERVICE
export const getAllTourService = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(Tour.find(), query);

    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]);

    return {
        data,
        meta
    };
};


// UPDATE TOUR SERVICE
export const updateTourService = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    };

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    return updatedTour;
};


// DELETE TOUR SERVICE
export const deleteTourService = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
};


// CREATE TOUR TYPE SERVICE
export const createTourTypeService = async (payload: ITourType) => {
    const { name } = payload;
    const existingTourType = await TourType.findOne({ name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    };

    return await TourType.create({ name });
};


// GET ALL TOUR TYPES SERVICE
export const getAllTourTypeService = async () => {
    return await TourType.find();
};


// UPDATE TOUR TYPE SERVICE
export const updateTourTypeService = async (id: string, payload: ITourType) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    };

    const updatedTourType = await TourType.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};


// DELETE TOUR TYPE SERVICE
export const deleteTourTypeService = async (id: string) => {
    const existingTourType = await TourType.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    };

    return await TourType.findByIdAndDelete(id);
};