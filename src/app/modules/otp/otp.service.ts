import crypto from "crypto";

import { User } from "../user/user.model";
import { ApiError } from "../../errors/ApiError";
import { sendEmail } from "../../utils/sendEmail";
import { redisClient } from "../../config/redis.config";



// OTP_EXPIRE
const OTP_EXPIRATION = 2 * 60

// GENERATE OTR
const generateOtp = (length = 6) => {
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};


// SEND OTP SERVICE
export const sendOTPService = async (email: string, name: string) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found")
    };

    if (user.isVerified) {
        throw new ApiError(401, "You are already verified")
    };
    const otp = generateOtp();

    const redisKey = `otp:${email}`

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    });
};


// VERIFY OTP SERVICE
export const verifyOTPService = async (email: string, otp: string) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User not found")
    };

    if (user.isVerified) {
        throw new ApiError(401, "You are already verified")
    };

    const redisKey = `otp:${email}`

    const savedOtp = await redisClient.get(redisKey);

    if (!savedOtp) {
        throw new ApiError(401, "Invalid OTP");
    };

    if (savedOtp !== otp) {
        throw new ApiError(401, "Invalid OTP");
    };

    await Promise.all([
        User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ]);
};