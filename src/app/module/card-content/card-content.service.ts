import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCardContentPayload, IUpdateCardContentPayload } from "./card-content.interface";

const getAllCardContents = async () => {
  return await prisma.cardContent.findMany({
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const getCardContentById = async (id: string) => {
  const content = await prisma.cardContent.findUnique({
    where: { id },
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
  if (!content) throw new AppError(status.NOT_FOUND, "Card content not found");
  return content;
};

const createCardContent = async (payload: ICreateCardContentPayload) => {
  return await prisma.cardContent.create({
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const updateCardContent = async (id: string, payload: IUpdateCardContentPayload) => {
  const content = await prisma.cardContent.findUnique({ where: { id } });
  if (!content) throw new AppError(status.NOT_FOUND, "Card content not found");

  return await prisma.cardContent.update({
    where: { id },
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const deleteCardContent = async (id: string) => {
  const content = await prisma.cardContent.findUnique({ where: { id } });
  if (!content) throw new AppError(status.NOT_FOUND, "Card content not found");

  return await prisma.cardContent.delete({
    where: { id }
  });
};

export const CardContentService = {
  getAllCardContents,
  getCardContentById,
  createCardContent,
  updateCardContent,
  deleteCardContent,
};

