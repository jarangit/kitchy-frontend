export interface IUser {
  id: number;
  email: string;
  name?: string;
}

export interface IAuthContext {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
