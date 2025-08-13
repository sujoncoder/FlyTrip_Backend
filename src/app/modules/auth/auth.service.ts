/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import { SECRET } from "../../config/env";
import { User } from "../user/user.model";
import { ApiError } from "../../errors/ApiError";
import { sendEmail } from "../../utils/sendEmail";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";



// CREDENTIAL LOGIN SERVICE
export const credentialLoginService = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Email does not exist")
    };

    const isPasswordMatched = await bcrypt.compare(password as string, isUserExist.password as string);

    if (!isPasswordMatched) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Incorrect Password")
    };

    const userToken = createUserTokens(isUserExist);

    const { password: pass, ...rest } = isUserExist.toObject();

    return {
        accessToken: userToken.accessToken,
        refreshToken: userToken.refreshToken,
        user: rest
    };
};


// GET NEW ACCESS TOKEN SERVICE
export const getNewAccessTokenService = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken);

    return {
        accessToken: newAccessToken
    };
};


// CHANGE PASSWORD SERVICE
export const changePasswordService = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    const user = await User.findById(decodedToken.userId);

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string);

    if (!isOldPasswordMatch) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Old password does not match !")
    };

    user!.password = await bcrypt.hash(newPassword, SECRET.BCRYPT_SALT_ROUND);

    user!.save();
};


// SET PASSWORD SERVICE
export const setPasswordService = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    };

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    };

    const hashedPassword = await bcrypt.hash(
        plainPassword,
        Number(SECRET.BCRYPT_SALT_ROUND)
    );

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    };

    const auths: IAuthProvider[] = [...user.auths, credentialProvider];

    user.password = hashedPassword;

    user.auths = auths;

    await user.save();
};


// FORGOT PASSWORD SERVICE
export const forgotPasswordService = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User does not exist")
    };

    if (!isUserExist.isVerified) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User is not verified")
    };

    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    };

    if (isUserExist.isDeleted) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "User is deleted")
    };

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };

    const resetToken = jwt.sign(jwtPayload, SECRET.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${SECRET.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    });
};


// RESET PASSWORD SERVICE
export const resetPasswordService = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new ApiError(401, "You can not reset your password");
    };

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new ApiError(401, "User does not exist");
    };

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(SECRET.BCRYPT_SALT_ROUND)
    );

    isUserExist.password = hashedPassword;

    await isUserExist.save();
};