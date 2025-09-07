export interface User {
  uid: string;
  username: string;
  email: string;
  password?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  uid: string;
  username: string;
  token: string;
}
