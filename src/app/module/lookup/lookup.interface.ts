export interface ILookupPayload {
  code: string;
  name: string;
  description?: string;
  organizationId?: string;
}

export interface ILookupValuePayload {
  value: string;
  label: string;
  sortOrder?: number;
  parentId?: string;
}
