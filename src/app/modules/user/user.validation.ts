import z from "zod";

import { addressField, emailField, nameField, passwordField, phoneField } from "../../utils/common.zod";

import { IsActive, Role } from "./user.interface";



// CREATE USER ZOD SCHEMA
export const createUserZodSchema = z.object({
    name: nameField,
    email: emailField,
    password: passwordField,
    phone: phoneField.optional(),
    address: addressField.optional(),
});


// UPDATE USER ZOD SCHEMA
export const updateUserZodSchema = z.object({
    name: nameField.optional(),
    password: passwordField.optional(),
    phone: phoneField.optional(),
    role: z.enum(Object.values(Role) as [string]).optional(),
    isActive: z.enum(Object.values(IsActive) as [string]).optional(),
    isDeleted: z.boolean({ error: "isDeleted must be true or false" }).optional(),
    isVerified: z.boolean({ error: "isVerified must be true or false" }).optional(),
    address: addressField.optional(),
});