export interface Quiz {
  QuizId: number;
  Title: string;
  SkillId?: number;
  Description?: string;
  IsActive: boolean;
  TimeAllowed: number;
  CreatedBy: number;
  CreatedAt: Date;
}
