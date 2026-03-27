import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateMaterialPayload, IUpdateMaterialPayload } from "./material.interface";

const getAllMaterials = async () => {
  return await prisma.material.findMany({
    where: { isDeleted: false },
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const getMaterialById = async (id: string) => {
  const material = await prisma.material.findUnique({
    where: { id, isDeleted: false },
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
  if (!material) throw new AppError(status.NOT_FOUND, "Material not found");
  return material;
};

const createMaterial = async (payload: ICreateMaterialPayload) => {
  return await prisma.material.create({
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const updateMaterial = async (id: string, payload: IUpdateMaterialPayload) => {
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material) throw new AppError(status.NOT_FOUND, "Material not found");

  return await prisma.material.update({
    where: { id },
    data: payload,
    include: {
      card: {
        select: { id: true, title: true }
      }
    },
  });
};

const deleteMaterial = async (id: string) => {
  const material = await prisma.material.findUnique({ where: { id } });
  if (!material) throw new AppError(status.NOT_FOUND, "Material not found");

  return await prisma.material.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const MaterialService = {
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
};

