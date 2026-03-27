import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { QuizService } from "./quiz.service";

const getAllQuizzes = catchAsync(async (req, res) => {
  const result = await QuizService.getAllQuizzes();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Quizzes retrieved successfully",
    data: result,
  });
});

const getQuizById = catchAsync(async (req, res) => {
  const result = await QuizService.getQuizById(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Quiz retrieved successfully",
    data: result,
  });
});

const createQuiz = catchAsync(async (req, res) => {
  const result = await QuizService.createQuiz(req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Quiz created successfully",
    data: result,
  });
});

const updateQuiz = catchAsync(async (req, res) => {
  const result = await QuizService.updateQuiz(req.params.id as string, req.body);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Quiz updated successfully",
    data: result,
  });
});

const deleteQuiz = catchAsync(async (req, res) => {
  const result = await QuizService.deleteQuiz(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Quiz deleted successfully",
    data: result,
  });
});

export const QuizController = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};

