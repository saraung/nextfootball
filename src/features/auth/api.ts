import api from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { User, LoginResponse, RegisterRequest } from "@/types/user";

export async function loginAPI(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", password);

  const { data } = await api.post<LoginResponse>(ENDPOINTS.AUTH_LOGIN, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function registerAPI(body: RegisterRequest): Promise<User> {
  const { data } = await api.post<User>(ENDPOINTS.AUTH_REGISTER, body);
  return data;
}

export async function getMeAPI(): Promise<User> {
  const { data } = await api.get<User>(ENDPOINTS.AUTH_ME);
  return data;
}
