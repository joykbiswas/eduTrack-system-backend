export interface ICreateClassPayload {
  name: string;
  description?: string;
  organizationId: string;
  teacherId?: string;
}

export interface IUpdateClassPayload {
  name?: string;
  description?: string;
  teacherId?: string;
}
