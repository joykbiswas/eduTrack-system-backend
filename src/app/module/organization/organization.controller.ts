import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrganizationService } from "./organization.service";

const getAllOrganizations = catchAsync(async (req, res) => {
  const result = await OrganizationService.getAllOrganizations();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Organizations retrieved successfully",
    data: result,
  });
});

const getOrganizationById = catchAsync(async (req, res) => {
  const result = await OrganizationService.getOrganizationById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Organization retrieved successfully",
    data: result,
  });
});

const createOrganization = catchAsync(async (req, res) => {
  const result = await OrganizationService.createOrganization(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Organization created successfully",
    data: result,
  });
});

const updateOrganization = catchAsync(async (req, res) => {
  const result = await OrganizationService.updateOrganization(req.params.id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Organization updated successfully",
    data: result,
  });
});

const deleteOrganization = catchAsync(async (req, res) => {
  const result = await OrganizationService.deleteOrganization(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Organization deleted successfully",
    data: result,
  });
});

export const OrganizationController = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
