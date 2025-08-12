// /* eslint-disable no-console */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// import PDFDocument from "pdfkit";
// import { ApiError } from "../errors/ApiError";

// export interface IInvoiceData {
//     transactionId: string;
//     bookingDate: Date;
//     userName: string;
//     tourTitle: string;
//     guestCount: number;
//     totalAmount: number;
// }

// export const generatePdf = async (
//     invoiceData: IInvoiceData
// ): Promise<Buffer<ArrayBufferLike>> => {
//     try {
//         return new Promise((resolve, reject) => {
//             const doc = new PDFDocument({ size: "A4", margin: 50 });
//             const buffer: Uint8Array[] = [];

//             doc.on("data", (chunk) => buffer.push(chunk));
//             doc.on("end", () => resolve(Buffer.concat(buffer)));
//             doc.on("error", (err) => reject(err));

//             // ===== HEADER BAR =====
//             doc.rect(0, 0, doc.page.width, 80).fill("#1e90ff");
//             doc.fillColor("#fff")
//                 .fontSize(30)
//                 .text("FlyTrip", 50, 25, { align: "left" })
//                 .fontSize(14)
//                 .text("Your Travel Companion", 50, 55);

//             // ===== INVOICE TITLE =====
//             doc.moveDown(3);
//             doc.fillColor("#333")
//                 .fontSize(22)
//                 .text("Payment Invoice", { align: "center", underline: true })
//                 .moveDown(2);

//             // ===== TRANSACTION INFO TABLE =====
//             const tableX = 50;
//             let tableY = doc.y;
//             const tableWidth = 500;
//             const rowHeight = 30;
//             const col1Width = 150;

//             const drawRow = (label: string, value: string, y: number) => {
//                 doc.rect(tableX, y, tableWidth, rowHeight).stroke("#1e90ff");
//                 doc.fillColor("#1e90ff").fontSize(12).text(label, tableX + 10, y + 10);
//                 doc.fillColor("#333").fontSize(12).text(value, tableX + col1Width, y + 10);
//             };

//             drawRow("Transaction ID", invoiceData.transactionId, tableY);
//             tableY += rowHeight;
//             drawRow("Booking Date", invoiceData.bookingDate.toDateString(), tableY);
//             tableY += rowHeight;
//             drawRow("Customer Name", invoiceData.userName, tableY);

//             doc.moveDown(5);

//             // ===== BOOKING SUMMARY TABLE =====
//             doc.fillColor("#1e90ff").fontSize(14).text("Booking Summary", { underline: true });
//             doc.moveDown(0.5);

//             let summaryY = doc.y;
//             const drawSummaryRow = (label: string, value: string, y: number, isTotal = false) => {
//                 doc.rect(tableX, y, tableWidth, rowHeight).stroke("#1e90ff");
//                 doc.fillColor("#1e90ff").fontSize(12).text(label, tableX + 10, y + 10);
//                 doc.fillColor(isTotal ? "#d32f2f" : "#333")
//                     .fontSize(isTotal ? 13 : 12)
//                     .text(value, tableX + col1Width, y + 10);
//             };

//             drawSummaryRow("Tour Title", invoiceData.tourTitle, summaryY);
//             summaryY += rowHeight;
//             drawSummaryRow("Guests", invoiceData.guestCount.toString(), summaryY);
//             summaryY += rowHeight;
//             drawSummaryRow("Total Amount", `$${invoiceData.totalAmount.toFixed(2)}`, summaryY, true);

//             doc.moveDown(6);

//             // ===== FOOTER =====
//             doc.fillColor("#555")
//                 .fontSize(12)
//                 .text("Thank you for booking with FlyTrip!", { align: "center" })
//                 .text("We wish you a safe and memorable journey!", { align: "center" });

//             doc.end();
//         });
//     } catch (error: any) {
//         console.log(error);
//         throw new ApiError(401, `Pdf creation error ${error.message}`);
//     }
// };





















/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import { ApiError } from "../errors/ApiError";

export interface IInvoiceData {
    transactionId: string;
    bookingDate: Date;
    userName: string;
    tourTitle: string;
    guestCount: number;
    totalAmount: number;
}

export const generatePdf = async (
    invoiceData: IInvoiceData
): Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffer: Uint8Array[] = [];

            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on("error", (err) => reject(err));

            // ===== HEADER BAR =====
            doc.rect(0, 0, doc.page.width, 80).fill("#1e90ff");
            doc.fillColor("#fff")
                .fontSize(30)
                .text("FlyTrip", 50, 25, { align: "left" })
                .fontSize(14)
                .text("Your Travel Companion", 50, 55);

            // ===== INVOICE TITLE =====
            doc.moveDown(3);
            doc.fillColor("#333")
                .fontSize(22)
                .text("Payment Invoice", { align: "center", underline: true })
                .moveDown(2);

            // ===== TRANSACTION INFO TABLE =====
            const tableX = 50;
            let tableY = doc.y;
            const tableWidth = 500;
            const rowHeight = 30;
            const col1Width = 150;

            const drawRow = (label: string, value: string, y: number) => {
                doc.rect(tableX, y, tableWidth, rowHeight).stroke("#1e90ff");
                doc.fillColor("#1e90ff").fontSize(12).text(label, tableX + 10, y + 10);
                doc.fillColor("#333").fontSize(12).text(value, tableX + col1Width, y + 10);
            };

            drawRow("Transaction ID", invoiceData.transactionId, tableY);
            tableY += rowHeight;
            drawRow("Booking Date", invoiceData.bookingDate.toDateString(), tableY);
            tableY += rowHeight;
            drawRow("Customer Name", invoiceData.userName, tableY);

            doc.moveDown(5);

            // ===== BOOKING SUMMARY TABLE =====
            doc.fillColor("#1e90ff").fontSize(14).text("Booking Summary", { underline: true });
            doc.moveDown(0.5);

            let summaryY = doc.y;
            const drawSummaryRow = (label: string, value: string, y: number, isTotal = false) => {
                doc.rect(tableX, y, tableWidth, rowHeight).stroke("#1e90ff");
                doc.fillColor("#1e90ff").fontSize(12).text(label, tableX + 10, y + 10);
                doc.fillColor(isTotal ? "#d32f2f" : "#333")
                    .fontSize(isTotal ? 13 : 12)
                    .text(value, tableX + col1Width, y + 10);
            };

            drawSummaryRow("Tour Title", invoiceData.tourTitle, summaryY);
            summaryY += rowHeight;
            drawSummaryRow("Guests", invoiceData.guestCount.toString(), summaryY);
            summaryY += rowHeight;
            drawSummaryRow("Total Amount", `$${invoiceData.totalAmount.toFixed(2)}`, summaryY, true);

            doc.moveDown(6);

            // ===== FOOTER =====
            doc.fillColor("#555")
                .fontSize(12)
                .text("Thank you for booking with FlyTrip!", { align: "center" })
                .text("We wish you a safe and memorable journey!", { align: "center" });

            doc.end();
        });
    } catch (error: any) {
        console.log(error);
        throw new ApiError(401, `Pdf creation error ${error.message}`);
    }
};