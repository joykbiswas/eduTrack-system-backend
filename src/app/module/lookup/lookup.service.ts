/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";

const getAllLookups = async () => {
  return await prisma.lookup.findMany({
    where: { isDeleted: false },
    include: { organization: true, values: true },
  });
};

const getLookupById = async (id: string) => {
  const lookup = await prisma.lookup.findUnique({
    where: { id, isDeleted: false },
    include: { organization: true, values: true },
  });
  if (!lookup) throw new AppError(status.NOT_FOUND, "Lookup not found");
  return lookup;
};

const createLookup = async (payload: any) => {
  return await prisma.lookup.create({
    data: payload,
    include: { organization: true, values: true },
  });
};

const updateLookup = async (id: string, payload: any) => {
  const lookup = await prisma.lookup.findUnique({ where: { id } });
  if (!lookup) throw new AppError(status.NOT_FOUND, "Lookup not found");

  return await prisma.lookup.update({
    where: { id },
    data: payload,
    include: { organization: true, values: true },
  });
};

const deleteLookup = async (id: string) => {
  const lookup = await prisma.lookup.findUnique({ where: { id } });
  if (!lookup) throw new AppError(status.NOT_FOUND, "Lookup not found");

  return await prisma.lookup.update({
    where: { id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
};

const addLookupValue = async (lookupId: string, payload: any) => {
  const lookup = await prisma.lookup.findUnique({ where: { id: lookupId } });
  if (!lookup) throw new AppError(status.NOT_FOUND, "Lookup not found");

  return await prisma.lookupValue.create({
    data: { ...payload, lookupId },
  });
};

export const LookupService = {
  getAllLookups,
  getLookupById,
  createLookup,
  updateLookup,
  deleteLookup,
  addLookupValue,
};
