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

export interface Data {
  balance: Balance;
  transactions: Transaction[];
  budgets: Budget[];
  pots: Pot[];
}
