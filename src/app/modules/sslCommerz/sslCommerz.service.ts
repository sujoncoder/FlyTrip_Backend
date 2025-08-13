/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import axios from "axios"

import { SECRET } from "../../config/env";
import { ApiError } from "../../errors/ApiError";
import { Payment } from "../payment/payment.model";
import { HTTP_STATUS } from "../../constants/httpStatus";

import { ISSLCommerz } from "./sslCommerz.interface"



// SSL PAYMENT INIT
export const sslPaymentInit = async (payload: ISSLCommerz) => {
    try {
        const data = {
            store_id: SECRET.SSL.STORE_ID,
            store_passwd: SECRET.SSL.STORE_PASS,
            total_amount: payload.amount,
            currency: "BDT",
            tran_id: payload.transactionId,
            success_url: `${SECRET.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
            fail_url: `${SECRET.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
            cancel_url: `${SECRET.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
            ipn_url: SECRET.SSL.SSL_IPN_URL,
            shipping_method: "N/A",
            product_name: "Tour",
            product_category: "Service",
            product_profile: "general",
            cus_name: payload.name,
            cus_email: payload.email,
            cus_add1: payload.address,
            cus_add2: "N/A",
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1000",
            cus_country: "Bangladesh",
            cus_phone: payload.phoneNumber,
            cus_fax: "01711111111",
            ship_name: "N/A",
            ship_add1: "N/A",
            ship_add2: "N/A",
            ship_city: "N/A",
            ship_state: "N/A",
            ship_postcode: 1000,
            ship_country: "N/A",
        };

        const response = await axios({
            method: "POST",
            url: SECRET.SSL.SSL_PAYMENT_API,
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        return response.data;
    } catch (error: any) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, error.message);
    }
};


// VALIDATED PAYMENT
export const validatePayment = async (payload: any) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${SECRET.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${SECRET.SSL.STORE_ID}&store_passwd=${SECRET.SSL.STORE_PASS}`
        });

        console.log("sslcomeerz validate api response", response.data);

        await Payment.updateOne(
            { transactionId: payload.tran_id },
            { paymentGatewayData: response.data },
            { runValidators: true })
    } catch (error: any) {
        console.log(error);
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Payment Validation Error, ${error.message}`);
    }
};