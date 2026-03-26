import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminService } from "./admin.service";
import { ICreateAdminPayload } from "./admin.interface";

const getAllAdmins = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AdminService.getAllAdmins();

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admins fetched successfully",
      data: result,
    });
  }
);

const getAdminById = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const admin = await AdminService.getAdminById(id as string);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin fetched successfully",
      data: admin,
    });
  }
);

const createAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const payload: ICreateAdminPayload = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return sendResponse(res, {
        statusCode: status.UNAUTHORIZED,
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await AdminService.createAdmin(userId, payload);

    sendResponse(res, {
      statusCode: status.CREATED,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  }
);

const updateAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const updatedAdmin = await AdminService.updateAdmin(id as string, payload);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  }
);

const deleteAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = req.user;

    const result = await AdminService.deleteAdmin(id as string, user);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  }
);

export const AdminController = {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};