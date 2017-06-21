export interface IUser {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  email: string;
  username: string;
  password: string;
  salt?: string;
  activeSessionToken: string;
  newSessionToken: string;
}
