/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";

const TOKEN_KEY = "__token";
const USER_KEY = "__user";

export interface TransactionInput {
  transferType: "pix" | "ted";
  beneficiaryName: string;
  amount: number;
  transactionDate: string;
  cpfCnpj?: string;
  bank?: string;
  branch?: string;
  accountNumber?: string;
  pixKey?: string;
}

function setSession(token: string, user: any) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser<T = any>(): T | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

function setStoredUser(user: any) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

const BASE_URL = "/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const t = getToken();
  if (t) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError<any>) => {
    const msg =
      (error.response?.data as any)?.message ||
      error.message ||
      `HTTP ${error.response?.status ?? "ERR"}`;

    if (error.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(new Error(msg));
  }
);

type ListTxParams = {
  type?: "pix" | "ted";
  presetDays?: 7 | 15 | 30 | 90;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sort?: "asc" | "desc";
};

export const api = {
  async register(data: { name: string; email: string; password: string }) {
    const res = await apiClient.post<{ token: string; user: any }>("/auth/register", data);
    const { token, user } = res.data;
    setSession(token, user);
    return user;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post<{ token: string; user: any }>("/auth/login", data);
    const { token, user } = res.data;
    setSession(token, user);
    return user;
  },

  async listTx(params?: ListTxParams) {
    const res = await apiClient.get<any[]>("/transactions", { params });
    return res.data;
  },

  async createTx(input: {
    transferType: "pix" | "ted";
    cpfCnpj?: string;
    beneficiaryName: string;
    bank?: string;
    branch?: string;
    accountNumber?: string;
    pixKey?: string;
    amount: number;
    transactionDate: string;
  }) {
    const res = await apiClient.post<any>("/transactions", input);
    const tx = res.data;

    const u = getStoredUser<any>();
    if (u && typeof u.balance === "number" && typeof tx?.amount === "number") {
      u.balance = Math.max(0, u.balance - tx.amount);
      setStoredUser(u);
    }

    return tx;
  },

  getToken,
  getStoredUser,
  clearSession,
};
