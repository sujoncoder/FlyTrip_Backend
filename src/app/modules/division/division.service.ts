import { Division } from "./division.model";
import { IDivision } from "./division.interface";

import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";



// CREATE DIVISION SERVICE
export const createDivisionService = async (payload: IDivision) => {
    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new Error("A division with this name already exists.");
    };

    const division = await Division.create(payload);

    return division;
};


// GET ALL DIVISION SERVICE
export const getAllDivisionService = async () => {
    const divisions = await Division.find({});
    const totalDivisions = await Division.countDocuments();
    return {
        data: divisions,
        meta: {
            total: totalDivisions
        }
    };
};


// GET SINGLE DIVISION SERVICE
export const getSingleDivisionService = async (slug: string) => {
    const division = await Division.findOne({ slug });
    return {
        data: division,
    };
};


// UPDATE DIVISION SERVICE
export const updateDivisionService = async (id: string, payload: Partial<IDivision>) => {

    const existingDivision = await Division.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found.");
    };

    const duplicateDivision = await Division.findOne({
        name: payload.name,
        _id: { $ne: id },
    });

    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    };

    const updatedDivision = await Division.findByIdAndUpdate(id, payload, { new: true, runValidators: true });

    if (payload.thumbnail && existingDivision.thumbnail) {
        await deleteImageFromCLoudinary(existingDivision.thumbnail)
    };

    return updatedDivision;
};


// DELETE DIVISION SERVICE
export const deleteDivisionService = async (id: string) => {
    await Division.findByIdAndDelete(id);
    return null;
};