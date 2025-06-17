export interface UserAttempt {
  AttemptId: number;
  UserId: number;
  QuizId: number;
  StartTime: Date;
  EndTime?: Date;
  RemainingTime?: number;
  Grade?: number;
}
