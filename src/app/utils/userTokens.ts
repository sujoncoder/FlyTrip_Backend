import { JwtPayload } from "jsonwebtoken";

import { SECRET } from "../config/env";
import { ApiError } from "../errors/ApiError";
import { User } from "../modules/user/user.model";
import { HTTP_STATUS } from "../constants/httpStatus";
import { IsActive, IUser } from "../modules/user/user.interface";

import { generateToken, verifyToken } from "./jwt";


// CREATE USER TOKEN
export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };

    const accessToken = generateToken(jwtPayload, SECRET.JWT_ACCESS_SECRET, SECRET.JWT_ACCESS_EXPIRES);

    const refreshToken = generateToken(jwtPayload, SECRET.JWT_REFRESH_SECRET, SECRET.JWT_REFRESH_EXPIRES);

    return {
        accessToken,
        refreshToken
    };
};


// CREATE NEW ACCESS TOKEN WITH REFRESH TOKEN
export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {
    const verifiedRefreshToken = verifyToken(refreshToken, SECRET.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

    if (!isUserExist) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User does not exist !")
    };

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `User is ${isUserExist.isActive} !`)
    };

    if (isUserExist.isDeleted) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User is deleted !")
    };

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };

    const accessToken = generateToken(jwtPayload, SECRET.JWT_ACCESS_SECRET, SECRET.JWT_ACCESS_EXPIRES);

    return accessToken;
};