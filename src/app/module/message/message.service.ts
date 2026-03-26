import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllMessages = async () => {
  return await prisma.message.findMany({
    where: { isDeleted: false },
    include: { sender: true, receiver: true, class: true },
  });
};

const getMessageById = async (id: string) => {
  const message = await prisma.message.findUnique({
    where: { id, isDeleted: false },
    include: { sender: true, receiver: true, class: true },
  });
  if (!message) throw new AppError(status.NOT_FOUND, "Message not found");
  return message;
};

const createMessage = async (payload: any) => {
  return await prisma.message.create({
    data: payload,
    include: { sender: true, receiver: true, class: true },
  });
};

const updateMessage = async (id: string, payload: any) => {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError(status.NOT_FOUND, "Message not found");

  return await prisma.message.update({
    where: { id },
    data: payload,
    include: { sender: true, receiver: true, class: true },
  });
};

const deleteMessage = async (id: string) => {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError(status.NOT_FOUND, "Message not found");

  return await prisma.message.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

const markAsRead = async (id: string) => {
  const message = await prisma.message.findUnique({ where: { id } });
  if (!message) throw new AppError(status.NOT_FOUND, "Message not found");

  return await prisma.message.update({
    where: { id },
    data: { isRead: true },
    include: { sender: true, receiver: true, class: true },
  });
};

export const MessageService = {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
};
