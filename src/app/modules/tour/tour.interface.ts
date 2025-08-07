import { Types } from "mongoose";




// TOUR TYPE
export interface ITourType {
    name: string;
};


// TOUR TYPE
export interface ITour {
    title: string;
    slug: string;
    description?: string;
    images?: string[];
    location?: string;
    costFrom?: number;
    startDate?: Date
    departureLocation?: string;
    arrivalLocation?: string;
    endDate?: Date;
    included?: string[];
    excluded?: string[]
    amenities?: string[];
    tourPlan?: string[];
    maxGuest?: number;
    minAge?: number;
    division: Types.ObjectId
    tourType: Types.ObjectId
};