export interface ICreateOrganizationPayload {
  name: string;
  description?: string;
  parentId?: string;
}

export interface IUpdateOrganizationPayload {
  name?: string;
  description?: string;
  parentId?: string;
}
