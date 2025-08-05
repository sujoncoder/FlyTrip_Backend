import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

import { SECRET } from "../../config/env";
import { ApiError } from "../../errors/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { User } from "./user.model";
import { IAuthProvider, IUser, Role } from "./user.interface";



// CREATE USER SERVICE
export const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User Already Exist")
    };

    const hashedPassword = await bcryptjs.hash(password as string, Number(SECRET.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string };


    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    });

    return user;
};


// UPDATE USER SERVICE
export const updateUserService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User Not Found")
    };

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, "You are not authorized");
        };

        if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, "You are not authorized");
        };
    };

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, "You are not authorized");
        };
    };

    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, SECRET.BCRYPT_SALT_ROUND)
    };

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

    return newUpdatedUser;
};


// GET ALL USERS SERVICE
export const getAllUserService = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
};