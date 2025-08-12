/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "../errors/ApiError";
import { SECRET } from "./env";


// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: SECRET.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: SECRET.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: SECRET.CLOUDINARY.CLOUDINARY_API_SECRET
});


export const deleteImageFromCLoudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

        const match = url.match(regex);

        console.log({ match });

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
        }
    } catch (error: any) {
        throw new ApiError(401, "Cloudinary image deletion failed", error.message)
    }
};

export const cloudinaryUpload = cloudinary;