import bcryptjs from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

import { SECRET } from "../../config/env";
import { ApiError } from "../../errors/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { User } from "./user.model";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";



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


// GET SINGLE USER SERVICE
export const getSingleUserService = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};


// GET MY PROFILE SERVICE
export const getMeService = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};


// UPDATE USER SERVICE
export const updateUserService = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
        if (userId !== decodedToken.userId) {
            throw new ApiError(401, "You are not authorized")
        }
    };

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User Not Found")
    };

    if (decodedToken.role === Role.ADMIN && ifUserExist.role === Role.SUPER_ADMIN) {
        throw new ApiError(401, "You are not authorized")
    };

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, "You are not authorized");
        }
    };

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
            throw new ApiError(HTTP_STATUS.FORBIDDEN, "You are not authorized");
        }
    };

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

    return newUpdatedUser;
};


// GET ALL USERS SERVICE
export const getAllUserService = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};