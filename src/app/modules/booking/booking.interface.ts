import { Types } from "mongoose";


// BOOKING_STATUS ENUM
export enum BOOKING_STATUS {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPLETE = "COMPLETE",
    FAILED = "FAILED"
};


// BOOKING TYPE
export interface IBooking {
    user: Types.ObjectId;
    tour: Types.ObjectId;
    payment?: Types.ObjectId;
    guestCount: number;
    status: BOOKING_STATUS;
    createdAt?: Date;
};