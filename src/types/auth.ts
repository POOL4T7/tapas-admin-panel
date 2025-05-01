export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  id?: string;
  email: string;
  password?: string;
  name?: string;
  token?: string;
}

export interface LoginResponse {
  user: LoginData;
  token: string;
}
