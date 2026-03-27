export interface ICreateMaterialPayload {
  title: string;
  content: string;
  type?: string;
  cardId?: string;
}

export interface IUpdateMaterialPayload {
  title?: string;
  content?: string;
  type?: string;
  cardId?: string;
}

