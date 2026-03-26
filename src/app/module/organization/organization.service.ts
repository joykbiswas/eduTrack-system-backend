import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateOrganizationPayload, IUpdateOrganizationPayload } from "./organization.interface";

const getAllOrganizations = async () => {
  return await prisma.organization.findMany({
    where: { isDeleted: false },
    include: { parent: true, children: true, classes: true, lookups: true },
  });
};

const getOrganizationById = async (id: string) => {
  const org = await prisma.organization.findUnique({
    where: { id, isDeleted: false },
    include: { parent: true, children: true, classes: true, lookups: true },
  });
  if (!org) throw new AppError(status.NOT_FOUND, "Organization not found");
  return org;
};

const createOrganization = async (payload: ICreateOrganizationPayload) => {
  if (payload.parentId) {
    const parent = await prisma.organization.findUnique({
      where: { id: payload.parentId },
    });
    if (!parent) throw new AppError(status.NOT_FOUND, "Parent organization not found");
  }

  return await prisma.organization.create({
    data: payload,
    include: { parent: true, children: true },
  });
};

const updateOrganization = async (id: string, payload: IUpdateOrganizationPayload) => {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw new AppError(status.NOT_FOUND, "Organization not found");

  return await prisma.organization.update({
    where: { id },
    data: payload,
    include: { parent: true, children: true, classes: true },
  });
};

const deleteOrganization = async (id: string) => {
  const org = await prisma.organization.findUnique({ where: { id } });
  if (!org) throw new AppError(status.NOT_FOUND, "Organization not found");

  return await prisma.organization.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

export const OrganizationService = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
};
