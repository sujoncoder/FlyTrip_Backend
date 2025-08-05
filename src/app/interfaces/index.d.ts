import { JwtPayload } from "jsonwebtoken";


// INJECT USER INTO REQUEST ===> EXPRES
declare global {
    namespace Express {
        interface Request {
            user: JwtPayload
        };
    };
};