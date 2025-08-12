/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";

import { SECRET } from "../../config/env";
import { ApiError } from "../../errors/ApiError";
import { catchAsync } from "../../utils/catchAsync";
import { setAuthCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import { HTTP_STATUS } from "../../constants/httpStatus";
import { createUserTokens } from "../../utils/userTokens";

import { changePasswordService, forgotPasswordService, getNewAccessTokenService, resetPasswordService, setPasswordService } from "./auth.service";



// CREDENTIAL LOGIN CONTROLLER
export const credentialLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    passport.authenticate("local", async (err: any, user: any, info: any) => {

        if (err) {

            // ❌❌❌❌❌
            // throw new AppError(401, "Some error")
            // next(err)
            // return new AppError(401, err)


            // ✅✅✅✅
            // return next(err)
            // console.log("from err");
            return next(new ApiError(401, err))
        }

        if (!user) {
            // console.log("from !user");
            // return new AppError(401, info.message)
            return next(new ApiError(401, info.message))
        };

        const userTokens = await createUserTokens(user)

        // delete user.toObject().password

        const { password: pass, ...rest } = user.toObject();

        setAuthCookie(res, userTokens);

        sendResponse(res, {
            success: true,
            statusCode: HTTP_STATUS.OK,
            message: "User Logged In Successfully",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest

            },
        });
    })(req, res, next);


    // const loginInfo = await credentialLoginService(req.body);
    // setAuthCookie(res, loginInfo);

    // sendResponse(res, {
    //     success: true,
    //     statusCode: HTTP_STATUS.OK,
    //     message: "User logged in successfully",
    //     data: loginInfo
    // });
});


// GET NEW ACCESS TOKEN CONTROLLER
export const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No refresh token received from cookies")
    };

    const tokenInfo = await getNewAccessTokenService(refreshToken as string);

    setAuthCookie(res, tokenInfo);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.OK,
        message: "New access token retrieved successfully",
        data: tokenInfo
    });
});


// LOGOUT CONTROLLER
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });


    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.OK,
        message: "User logout successfully",
        data: null
    });
});


// CHANGE PASSWORD CONTROLLER
export const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await changePasswordService(oldPassword, newPassword, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.OK,
        message: "Password changed successfully",
        data: null
    });
});


// SET PASSWORD CONTROLLER
export const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload
    const { password } = req.body;

    await setPasswordService(decodedToken.userId, password);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.OK,
        message: "Password Changed Successfully",
        data: null,
    });
});


// FORGOT PASSWORD CONTROLLER
export const forgotPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await forgotPasswordService(email);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.OK,
        message: "Email Sent Successfully",
        data: null,
    })
})


// RESET PASSWORD CONTROLLER
export const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;
    await resetPasswordService(req.body, decodedToken as JwtPayload);

    sendResponse(res, {
        success: true,
        statusCode: HTTP_STATUS.OK,
        message: "Password Changed Successfully",
        data: null,
    });
})


// GOOGLE CALL BACK URL CONTROLLER
export const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    };

    // /booking => booking , => "/" => ""
    const user = req.user;

    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, "User Not Found")
    };

    const tokenInfo = createUserTokens(user);

    setAuthCookie(res, tokenInfo);

    res.redirect(`${SECRET.FRONTEND_URL}/${redirectTo}`);
});