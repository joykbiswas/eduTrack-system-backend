/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuizType } from '../../../generated/prisma/enums';

export interface ICreateQuizPayload {
  cardId: string;
  type: QuizType;
  question: string;
  options?: any; // Json
  correctAnswer: any; // Json
  points?: number;
}

export interface IUpdateQuizPayload {
  cardId?: string;
  type?: QuizType;
  question?: string;
  options?: any;
  correctAnswer?: any;
  points?: number;
}

