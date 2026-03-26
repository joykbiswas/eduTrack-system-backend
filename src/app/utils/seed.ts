import { envVars } from "../../config/env";
import { Role } from "../../generated/prisma/enums";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

// ==================== SEED SUPER ADMIN ====================
export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await prisma.user.findFirst({
            where: {
                role: Role.SUPER_ADMIN
            }
        });

        if (isSuperAdminExist) {
            console.log("Super admin already exists. Skipping seeding super admin.");
            return;
        }

        const superAdminUser = await auth.api.signUpEmail({
            body: {
                email: envVars.SUPER_ADMIN_EMAIL,
                password: envVars.SUPER_ADMIN_PASSWORD,
                name: "Super Admin",
                role: Role.SUPER_ADMIN,
                needPasswordChange: false,
            }
        });

        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: superAdminUser.user.id
                },
                data: {
                    emailVerified: true,
                }
            });

            await tx.admin.create({
                data: {
                    userId: superAdminUser.user.id,
                    name: "Super Admin",
                    email: envVars.SUPER_ADMIN_EMAIL,
                }
            });
        });

        const superAdmin = await prisma.admin.findFirst({
            where: {
                email: envVars.SUPER_ADMIN_EMAIL,
            },
            include: {
                user: true,
            }
        });

        console.log("Super Admin Created ", superAdmin);
    } catch (error) {
        console.error("Error seeding super admin: ", error);
    }
};

// ==================== CREATE ADMIN USER ====================
interface ICreateAdminPayload {
    email: string;
    password: string;
    name: string;
    profilePhoto?: string;
    contactNumber?: string;
}

export const createAdmin = async (payload: ICreateAdminPayload) => {
    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: payload.email
            }
        });

        if (existingUser) {
            console.log(`Admin with email ${payload.email} already exists.`);
            return null;
        }

        // Create user with Better Auth
        const userData = await auth.api.signUpEmail({
            body: {
                email: payload.email,
                password: payload.password,
                name: payload.name,
                role: Role.ADMIN,
                needPasswordChange: false,
            }
        });

        // Create admin profile
        const admin = await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: {
                    id: userData.user.id
                },
                data: {
                    emailVerified: true,
                }
            });

            return await tx.admin.create({
                data: {
                    userId: userData.user.id,
                    name: payload.name,
                    email: payload.email,
                    profilePhoto: payload.profilePhoto,
                    contactNumber: payload.contactNumber,
                }
            });
        });

        console.log(`Admin ${payload.name} created successfully!`);
        return admin;
    } catch (error) {
        console.error("Error creating admin: ", error);
        return null;
    }
};

// ==================== SEED DEFAULT ADMINS ====================
export const seedDefaultAdmins = async () => {
    const defaultAdmins = [
        {
            email: "admin@edutrack.com",
            password: "Admin123!",
            name: "Admin User",
        },
        {
            email: "support@edutrack.com",
            password: "Support123!",
            name: "Support Admin",
        },
    ];

    for (const admin of defaultAdmins) {
        await createAdmin(admin);
    }
};

// ==================== RUN ALL SEEDS ====================
export const runAllSeeds = async () => {
    console.log("Starting database seeding...");
    
    await seedSuperAdmin();
    await seedDefaultAdmins();
    
    console.log("Database seeding completed!");
};
