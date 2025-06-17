export interface AuditTrail {
  AuditId: number;
  TableName: string;
  RecordId: number;
  Action: string;
  UserId: number;
  ChangeTimestamp: Date;
  OldValues: string;
  NewValues: string;
  Context: string;
}
