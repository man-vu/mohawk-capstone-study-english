export interface Question {
  QuestionId: number;
  TypeId: number;
  InstructionId: number;
  IsActive: boolean;
  ParagraphTitle: string;
  QuestionText: string;
  CreatedAt: Date;
}
