export interface ICreateStudentPayload {
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
}

export interface IUpdateStudentPayload {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
}

export interface IEnrollStudentInClassPayload {
  classId: string;
}
