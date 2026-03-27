import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateQuizPayload, IUpdateQuizPayload } from "./quiz.interface";

const getAllQuizzes = async () => {
  return await prisma.quiz.findMany({
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const getQuizById = async (id: string) => {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
  if (!quiz) throw new AppError(status.NOT_FOUND, "Quiz not found");
  return quiz;
};

const createQuiz = async (payload: ICreateQuizPayload) => {
  return await prisma.quiz.create({
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const updateQuiz = async (id: string, payload: IUpdateQuizPayload) => {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new AppError(status.NOT_FOUND, "Quiz not found");

  return await prisma.quiz.update({
    where: { id },
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const deleteQuiz = async (id: string) => {
  const quiz = await prisma.quiz.findUnique({ where: { id } });
  if (!quiz) throw new AppError(status.NOT_FOUND, "Quiz not found");

  return await prisma.quiz.delete({
    where: { id }
  });
};

export const QuizService = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};

