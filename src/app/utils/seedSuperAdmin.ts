/* eslint-disable no-console */
import bcryptjs from "bcryptjs";

import { SECRET } from "../config/env";
import { User } from "../modules/user/user.model";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";


// SEED SUPER ADMIN
export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: SECRET.SUPER_ADMIN_EMAIL });

        if (isSuperAdminExist) {
            console.log("⚠️  Super Admin Already Exists!");
            return;
        };

        console.log("🔁 Trying to create Super Admin...");

        const hashedPassword = await bcryptjs.hash(SECRET.SUPER_ADMIN_PASSWORD, Number(SECRET.BCRYPT_SALT_ROUND));

        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: SECRET.SUPER_ADMIN_EMAIL
        };

        const payload: IUser = {
            name: "Super admin",
            role: Role.SUPER_ADMIN,
            email: SECRET.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isVerified: true,
            auths: [authProvider]
        };

        await User.create(payload);
        console.log("🦸 Super Admin Created Successfuly! \n");

    } catch (error) {
        console.log(error);
    }
};