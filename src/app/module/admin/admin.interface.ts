import { Role } from "../../../generated/prisma/enums";

export interface ICreateAdminPayload {
  password: string;
  admin: {
    name: string;
    email: string;
    role?: Role;
    profilePhoto?: string;
    contactNumber?: string;
  };
}

export interface IUpdateAdminPayload {
  name?: string;
  role?: Role;
  profilePhoto?: string;
  contactNumber?: string;
}