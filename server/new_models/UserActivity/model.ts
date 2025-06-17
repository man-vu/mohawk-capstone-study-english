export interface UserActivity {
  ActivityId: number;
  UserId: number;
  ActivityType: string;
  TargetId?: number;
  ActivityTime: Date;
  Details: string;
}
