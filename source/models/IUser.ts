export interface IUser {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  trainerId?: string;
  email: string;
  username: string;
  password: string;
  salt?: string;
  activeSessionToken?: string;
  newSessionToken?: string;
}
