import status from "http-status";
import { UserStatus, Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IUpdateAdminPayload, ICreateAdminPayload } from "./admin.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const getAllAdmins = async () => {
  const admins = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });

  return admins;
};

const getAdminById = async (id: string) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });

  if (!admin) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  return admin;
};

const createAdmin = async (payload: ICreateAdminPayload) => {
  // Check if user with email already exists
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email
    }
  });

  if (userExists) {
    throw new AppError(status.CONFLICT, "User with this email already exists");
  }

  // Create user with Better Auth
  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: payload.admin.role || Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
    }
  });

  try {
    const admin = await prisma.$transaction(async (tx) => {
      // Create admin profile
      const adminData = await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.admin.name,
          email: payload.admin.email,
          role: payload.admin.role || Role.ADMIN,
          profilePhoto: payload.admin.profilePhoto,
          contactNumber: payload.admin.contactNumber,
        }
      });

      return adminData;
    });

    return admin;
  } catch (error) {
    console.log("Transaction error : ", error);
    await prisma.user.delete({
      where: {
        id: userData.user.id
      }
    });
    throw error;
  }
};

const updateAdmin = async (id: string, payload: IUpdateAdminPayload) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const { role, ...adminData } = payload;

  const result = await prisma.$transaction(async (tx) => {
    if (role) {
      await tx.user.update({
        where: { id: isAdminExist.userId },
        data: { role },
      });
    }

    const updatedAdmin = await tx.admin.update({
      where: {
        id,
      },
      data: {
        ...adminData,
        ...(role && { role }),
      },
      include: {
        user: true,
      },
    });

    return updatedAdmin;
  });

  return result;
};

const deleteAdmin = async (id: string, user: IRequestUser) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  if (isAdminExist.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isAdminExist.userId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    await tx.account.deleteMany({
      where: { userId: isAdminExist.userId },
    });

    const admin = await tx.admin.findUnique({
      where: { id },
      include: { user: true },
    });

    return admin;
  });

  return result;
};

export const AdminService = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};