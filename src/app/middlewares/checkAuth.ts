import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

import { SECRET } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../errors/ApiError";
import { User } from "../modules/user/user.model";
import { HTTP_STATUS } from "../constants/httpStatus";
import { IsActive } from "../modules/user/user.interface";



// CHECK AUTH MIDDLEWARE
export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new ApiError(403, "No Token Recieved")
        };

        const verifiedToken = verifyToken(accessToken, SECRET.JWT_ACCESS_SECRET) as JwtPayload;

        const isUserExist = await User.findOne({ email: verifiedToken.email });

        if (!isUserExist) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User does not exist !")
        };

        if (!isUserExist.isVerified) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User is not verified")
        };

        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, `User is ${isUserExist.isActive} !`)
        };

        if (isUserExist.isDeleted) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User is deleted !")
        };

        if (!authRoles.includes(verifiedToken.role)) {
            throw new ApiError(403, "You are not permitted to view this route !")
        };

        req.user = verifiedToken;

        next();

    } catch (error) {
        next(error);
    };
};