import { api } from "./client";

export interface User {

  id: number;

  username: string;

  email: string;

  first_name: string;

  last_name: string;

  telephone: string;

  photo: string | null;

  role:
    | "ADMIN"
    | "ENSEIGNANT"
    | "ELEVE"
    | "PARENT";

  date_creation: string;
}


interface LoginResponse {

  success: boolean;

  message: string;

  user: User;

  tokens: {

    access: string;

    refresh: string;
  };
}


interface MeResponse {

  success: boolean;

  user: User;
}


export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {

  const response =
    await api.post<LoginResponse>(
      "/auth/login/",
      {
        username,
        password,
      }
    );

  const data = response.data;

  localStorage.setItem(
    "access_token",
    data.tokens.access
  );

  localStorage.setItem(
    "refresh_token",
    data.tokens.refresh
  );

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  return data;
}


export async function getMe(): Promise<User> {

  const response =
    await api.get<MeResponse>(
      "/auth/me/"
    );

  localStorage.setItem(
    "user",
    JSON.stringify(
      response.data.user
    )
  );

  return response.data.user;
}


export async function register(
  data: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    telephone?: string;
    password: string;
    password_confirmation: string;
  }
) {

  const response =
    await api.post(
      "/auth/register/",
      data
    );

  const result =
    response.data;

  localStorage.setItem(
    "access_token",
    result.tokens.access
  );

  localStorage.setItem(
    "refresh_token",
    result.tokens.refresh
  );

  localStorage.setItem(
    "user",
    JSON.stringify(
      result.user
    )
  );

  return result;
}


export function logout() {

  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "refresh_token"
  );

  localStorage.removeItem(
    "user"
  );
}


export function getStoredUser(): User | null {

  const user =
    localStorage.getItem(
      "user"
    );

  if (!user) {
    return null;
  }

  try {

    return JSON.parse(
      user
    );

  } catch {

    return null;
  }
}


export function isAuthenticated(): boolean {

  return Boolean(
    localStorage.getItem(
      "access_token"
    )
  );
}
