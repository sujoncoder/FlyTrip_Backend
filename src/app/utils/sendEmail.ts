/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import ejs from "ejs";
import path from "path";
import nodemailer from "nodemailer";

import { SECRET } from "../config/env";
import { ApiError } from "../errors/ApiError";



// NODEMAILER TRANSPORTER
const transporter = nodemailer.createTransport({
    // port: SECRET.EMAIL_SENDER.SMTP_PORT,
    secure: true,
    auth: {
        user: SECRET.EMAIL_SENDER.SMTP_USER,
        pass: SECRET.EMAIL_SENDER.SMTP_PASS
    },
    port: Number(SECRET.EMAIL_SENDER.SMTP_PORT),
    host: SECRET.EMAIL_SENDER.SMTP_HOST
});

interface SendEmailOptions {
    to: string,
    subject: string;
    templateName: string;
    templateData?: Record<string, any>
    attachments?: {
        filename: string,
        content: Buffer | string,
        contentType: string
    }[];
};

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: SendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: SECRET.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.filename,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })
    } catch (error: any) {
        throw new ApiError(401, "Email error");
    }
};