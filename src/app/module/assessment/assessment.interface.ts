export interface ICreateAssessmentPayload {
  title: string;
  description?: string;
  cardId?: string;
  questions: Array<{
    question: string;
    answer: boolean;
  }>;
  passingScore?: number;
}

export interface IUpdateAssessmentPayload {
  title?: string;
  description?: string;
  cardId?: string;
  questions?: Array<{
    question: string;
    answer: boolean;
  }>;
  passingScore?: number;
}

