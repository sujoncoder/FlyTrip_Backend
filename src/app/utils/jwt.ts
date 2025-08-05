import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


// GENERATE JWT TOKEN
export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, { expiresIn } as SignOptions);

    return token;
};


// VERIFY JWT TOKEN
export const verifyToken = (token: string, secret: string) => {
    const verifiedToken = jwt.verify(token, secret);

    return verifiedToken;
};