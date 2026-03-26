export interface ITaskPayload {
  title: string;
  description?: string;
  cardId?: string;
  dueDate?: Date;
  status?: string;
  classId?: string;
}
