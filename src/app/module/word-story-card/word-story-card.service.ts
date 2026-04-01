/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllCards = async () => {
  return await prisma.wordStoryCard.findMany({
    where: { isDeleted: false },
    include: { cardContents: true, quizzes: true, materials: true, assessments: true },
  });
};

const getCardById = async (id: string) => {
  const card = await prisma.wordStoryCard.findUnique({
    where: { id, isDeleted: false },
    include: { cardContents: true, quizzes: true, materials: true,  assessments: true },
  });
  if (!card) throw new AppError(status.NOT_FOUND, "Card not found");
  return card;
};

const createCard = async (payload: any) => {
  return await prisma.wordStoryCard.create({
    data: payload,
    include: { cardContents: true, quizzes: true, materials: true },
  });
};

const updateCard = async (id: string, payload: any) => {
  const card = await prisma.wordStoryCard.findUnique({ where: { id } });
  if (!card) throw new AppError(status.NOT_FOUND, "Card not found");

  return await prisma.wordStoryCard.update({
    where: { id },
    data: payload,
    include: { cardContents: true, quizzes: true, materials: true,  assessments: true },
  });
};

const deleteCard = async (id: string) => {
  const card = await prisma.wordStoryCard.findUnique({ where: { id } });
  if (!card) throw new AppError(status.NOT_FOUND, "Card not found");

  return await prisma.wordStoryCard.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

const publishCard = async (id: string) => {
  const card = await prisma.wordStoryCard.findUnique({ where: { id } });
  if (!card) throw new AppError(status.NOT_FOUND, "Card not found");

  return await prisma.wordStoryCard.update({
    where: { id },
    data: { status: "PUBLISHED" },
    include: { cardContents: true, quizzes: true, materials: true,  assessments: true },
  });
};

const getPublishedCards = async () => {
  return await prisma.wordStoryCard.findMany({
    where: { isDeleted: false, status: "PUBLISHED" },
    include: { cardContents: true, quizzes: true, materials: true, assessments: true },
  });
};

export const WordStoryCardService = {
  getAllCards,
  getPublishedCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
  publishCard,
};

