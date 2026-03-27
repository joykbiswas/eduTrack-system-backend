import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { MaterialService } from "./material.service";

const getAllMaterials = catchAsync(async (req, res) => {
  const result = await MaterialService.getAllMaterials();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Materials retrieved successfully",
    data: result,
  });
});

const getMaterialById = catchAsync(async (req, res) => {
  const result = await MaterialService.getMaterialById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Material retrieved successfully",
    data: result,
  });
});

const createMaterial = catchAsync(async (req, res) => {
  const result = await MaterialService.createMaterial(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Material created successfully",
    data: result,
  });
});

const updateMaterial = catchAsync(async (req, res) => {
  const result = await MaterialService.updateMaterial(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Material updated successfully",
    data: result,
  });
});

const deleteMaterial = catchAsync(async (req, res) => {
  const result = await MaterialService.deleteMaterial(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Material deleted successfully",
    data: result,
  });
});

export const MaterialController = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

