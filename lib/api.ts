// lib/api.ts
import data from "../data.json";

// --- TYPES ---
export interface User {
  email: string;
  password: string;
}

export interface Balance {
  current: number;
  income: number;
  expenses: number;
}

export interface Transaction {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}

export interface Budget {
  id: string;
  category: string;
  maximum: number;
  theme: string;
}

export interface Pot {
  id: string;
  name: string;
  target: number;
  total: number;
  theme: string;
}

// --- HELPERS ---
const getUsers = (): User[] => {
  if (typeof window === "undefined") return []; // server: return empty
  return JSON.parse(localStorage.getItem("users") || "[]");
};

const saveUsers = (users: User[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("users", JSON.stringify(users));
};

// --- API ---
export const api = {
  // --- AUTH ---
  signup: async (email: string, password: string): Promise<{ success: boolean }> => {
    const users = getUsers();
    const exists = users.find((u) => u.email === email);
    if (exists) throw new Error("User already exists");

    users.push({ email, password });
    saveUsers(users);

    return { success: true };
  },

  login: async (email: string, password: string): Promise<{ token: string }> => {
    const users = getUsers();
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid credentials");

    return { token: "mock-token-12345" }; // mock token
  },

  // --- BALANCE ---
  getBalance: async (): Promise<Balance> => data.balance,

  // --- TRANSACTIONS ---
  getTransactions: async (): Promise<Transaction[]> => data.transactions,

  // --- BUDGETS ---
  getBudgets: async (): Promise<Budget[]> => data.budgets,

  // --- POTS ---
  getPots: async (): Promise<Pot[]> => data.pots,
};
