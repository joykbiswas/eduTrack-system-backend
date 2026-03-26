import { Gender } from "../../../generated/prisma/enums";

export interface ICreateTeacherPayload {
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  registrationNumber: string;
  experience?: number;
  gender: Gender;
  qualification: string;
  currentWorkingPlace?: string;
  designation: string;
}

export interface IUpdateTeacherPayload {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  experience?: number;
  gender?: Gender;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
}
