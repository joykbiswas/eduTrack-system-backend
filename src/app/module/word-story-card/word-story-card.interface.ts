export interface IWordStoryCardPayload {
  title: string;
  keywords?: string;
  description?: string;
  descriptionSound?: string;
  dialogTitle?: string;
  dialogContent?: any;
  status?: string;
}

export interface ITaskPayload {
  title: string;
  description?: string;
  cardId?: string;
  dueDate?: Date;
  status?: string;
  classId?: string;
}

export interface IMessagePayload {
  title: string;
  content?: string;
  audioUrl?: string;
  senderId: string;
  receiverId?: string;
  classId?: string;
  receiverType?: string;
}
