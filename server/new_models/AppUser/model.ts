export interface AppUser {
  UserId: number;
  Email: string;
  PasswordHash: string;
  PasswordSalt: string;
  Gender: string;
  RoleId: number;
  ProfilePictureId?: number;
  CreatedAt: Date;
  FirstName: string;
  LastName: string;
  PasswordResetHash: string;
  PasswordResetSalt: string;
  PasswordResetExpiry: Date;
}
