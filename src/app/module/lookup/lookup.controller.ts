import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { LookupService } from "./lookup.service";

const getAllLookups = catchAsync(async (req, res) => {
  const result = await LookupService.getAllLookups();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Lookups retrieved successfully",
    data: result,
  });
});

const getLookupById = catchAsync(async (req, res) => {
  const result = await LookupService.getLookupById(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Lookup retrieved successfully",
    data: result,
  });
});

const createLookup = catchAsync(async (req, res) => {
  const result = await LookupService.createLookup(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Lookup created successfully",
    data: result,
  });
});

const updateLookup = catchAsync(async (req, res) => {
  const result = await LookupService.updateLookup(req.params.id, req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Lookup updated successfully",
    data: result,
  });
});

const deleteLookup = catchAsync(async (req, res) => {
  const result = await LookupService.deleteLookup(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Lookup deleted successfully",
    data: result,
  });
});

const addLookupValue = catchAsync(async (req, res) => {
  const result = await LookupService.addLookupValue(req.params.id, req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Lookup value added successfully",
    data: result,
  });
});

export const LookupController = {
  getAllLookups,
  getLookupById,
  createLookup,
  updateLookup,
  deleteLookup,
  addLookupValue,
};
