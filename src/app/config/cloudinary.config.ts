/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import stream from "stream";

import { ApiError } from "../errors/ApiError";

import { SECRET } from "./env";



// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: SECRET.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
    api_key: SECRET.CLOUDINARY.CLOUDINARY_API_KEY,
    api_secret: SECRET.CLOUDINARY.CLOUDINARY_API_SECRET
});


// PDF UPLOAD TO CLOUDINARY
export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
    try {
        return new Promise((resolve, reject) => {

            const public_id = `pdf/${fileName}-${Date.now()}`

            const bufferStream = new stream.PassThrough();
            bufferStream.end(buffer);

            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    public_id: public_id,
                    folder: "pdf"
                },
                (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(result)
                }
            ).end(buffer);
        });

    } catch (error: any) {
        console.log(error);
        throw new ApiError(401, `Error uploading file ${error.message}`);
    };
};


// DELETE IMAGE FROM CLOUDINARY
export const deleteImageFromCLoudinary = async (url: string) => {
    try {
        const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;

        const match = url.match(regex);

        console.log({ match });

        if (match && match[1]) {
            const public_id = match[1];
            await cloudinary.uploader.destroy(public_id)
            console.log(`File ${public_id} is deleted from cloudinary`);
        };
    } catch (error: any) {
        throw new ApiError(401, "Cloudinary image deletion failed", error.message)
    }
};

export const cloudinaryUpload = cloudinary;