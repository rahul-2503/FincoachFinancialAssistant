
export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
}

export enum TransactionCategory {
  SALARY = 'Salary',
  FOOD = 'Food',
  BILLS = 'Bills',
  TRANSPORT = 'Transport',
  ENTERTAINMENT = 'Entertainment',
  SHOPPING = 'Shopping',
  HEALTH = 'Health',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
  date: string; // ISO string format
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export interface ForecastData {
    name: string;
    expense: number;
}
