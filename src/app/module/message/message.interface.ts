export interface IMessagePayload {
  title: string;
  content?: string;
  audioUrl?: string;
  senderId: string;
  receiverId?: string;
  classId?: string;
  receiverType?: string;
}
