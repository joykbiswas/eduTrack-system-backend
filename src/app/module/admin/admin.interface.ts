export interface ICreateAdminPayload {
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
}

export interface IUpdateAdminPayload {
  name?: string;
  profilePhoto?: string;
  contactNumber?: string;
}