import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AssessmentService } from "./assessment.service";

const getAllAssessments = catchAsync(async (req, res) => {
  const result = await AssessmentService.getAllAssessments();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Assessments retrieved successfully",
    data: result,
  });
});

const getAssessmentById = catchAsync(async (req, res) => {
  const result = await AssessmentService.getAssessmentById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Assessment retrieved successfully",
    data: result,
  });
});

const createAssessment = catchAsync(async (req, res) => {
  const result = await AssessmentService.createAssessment(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Assessment created successfully",
    data: result,
  });
});

const updateAssessment = catchAsync(async (req, res) => {
  const result = await AssessmentService.updateAssessment(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Assessment updated successfully",
    data: result,
  });
});

const deleteAssessment = catchAsync(async (req, res) => {
  const result = await AssessmentService.deleteAssessment(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Assessment deleted successfully",
    data: result,
  });
});

export const AssessmentController = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
};

