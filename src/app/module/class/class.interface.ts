export interface ICreateClassPayload {
  name: string;
  description?: string;
  classNumber?: number;
  sectionCode?: string;
  academicYear?: string;
  organizationId: string;
  teacherId?: string;
}

export interface IUpdateClassPayload {
  name?: string;
  description?: string;
  classNumber?: number;
  sectionCode?: string;
  academicYear?: string;
  teacherId?: string;
}
