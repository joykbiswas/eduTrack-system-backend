import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateAssessmentPayload, IUpdateAssessmentPayload } from "./assessment.interface";

const getAllAssessments = async () => {
  return await prisma.assessment.findMany({
    where: { isDeleted: false },
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const getAssessmentById = async (id: string) => {
  const assessment = await prisma.assessment.findUnique({
    where: { id, isDeleted: false },
  });
  if (!assessment) throw new AppError(status.NOT_FOUND, "Assessment not found");
  return assessment;
};

const createAssessment = async (payload: ICreateAssessmentPayload) => {
  return await prisma.assessment.create({
    data: payload,
  });
};

const updateAssessment = async (id: string, payload: IUpdateAssessmentPayload) => {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new AppError(status.NOT_FOUND, "Assessment not found");

  return await prisma.assessment.update({
    where: { id },
    data: payload,
  });
};

const deleteAssessment = async (id: string) => {
  const assessment = await prisma.assessment.findUnique({ where: { id } });
  if (!assessment) throw new AppError(status.NOT_FOUND, "Assessment not found");

  return await prisma.assessment.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const AssessmentService = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
};

