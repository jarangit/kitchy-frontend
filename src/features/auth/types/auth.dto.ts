export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  email?: string;
  phoneNumber?: string;
  password: string;
}

export interface IGoogleLoginRequest {
  idToken: string;
}
