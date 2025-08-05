import z from "zod";


// COMMON ZOD FIELDs
export const nameField = z
    .string({
        error: (issue) =>
            issue.input === undefined ? "Name is required" : "Name must be a string",
    })
    .min(2, { error: "Name must be at least 2 characters long." })
    .max(50, { error: "Name cannot exceed 50 characters." });


export const emailField = z
    .string({
        error: (issue) =>
            issue.input === undefined ? "Email is required" : "Email must be a string",
    })
    .email({ error: "Invalid email address format." })
    .min(5, { error: "Email must be at least 5 characters long." })
    .max(100, { error: "Email cannot exceed 100 characters." });


export const passwordField = z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "Password is required"
                : "Password must be a string",
    })
    .min(8, { error: "Password must be at least 8 characters long." })
    .regex(/^(?=.*[A-Z])/, { error: "Password must contain at least 1 uppercase letter." })
    .regex(/^(?=.*[!@#$%^&*])/, { error: "Password must contain at least 1 special character." })
    .regex(/^(?=.*\d)/, { error: "Password must contain at least 1 number." });


export const phoneField = z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "Phone number is required"
                : "Phone number must be a string",
    })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        error: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    });


export const addressField = z
    .string({
        error: (issue) =>
            issue.input === undefined
                ? "Address is required"
                : "Address must be a string",
    })
    .max(200, { error: "Address cannot exceed 200 characters." });