export interface ICreateCardContentPayload {
  cardId: string;
  imageUrl?: string;
  soundUrl?: string;
  xPosition?: number;
  yPosition?: number;
  width?: number;
  height?: number;
  seq?: number;
}

export interface IUpdateCardContentPayload {
  cardId?: string;
  imageUrl?: string;
  soundUrl?: string;
  xPosition?: number;
  yPosition?: number;
  width?: number;
  height?: number;
  seq?: number;
}

