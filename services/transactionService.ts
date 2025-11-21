import { Transaction, TransactionType, ForecastData } from '../types';

const API_BASE_URL = "http://127.0.0.1:8000";

// ✅ Correctly map backend (_id) → frontend (id)
const mapApiTransactionToFrontend = (apiTxn: any): Transaction => {
  return {
    id: apiTxn._id, // ✅ FIXED: use MongoDB _id
    description: apiTxn.description,
    amount: apiTxn.amount,
    type: apiTxn.type
      ? (apiTxn.type.charAt(0).toUpperCase() + apiTxn.type.slice(1)) as TransactionType
      : TransactionType.EXPENSE,
    category: apiTxn.category,
    date: apiTxn.date, // ISO string (handled fine by frontend)
  };
};

// ✅ Fetch all transactions
export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data.map(mapApiTransactionToFrontend);
  } catch (error) {
    console.error("Error fetching transactions from API:", error);
    return []; // Return empty list gracefully
  }
};

// ✅ Add new transaction
export const addTransaction = async (
  transaction: Omit<Transaction, 'id' | 'date'>
): Promise<Transaction> => {
  try {
    const response = await fetch(`${API_BASE_URL}/add_transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });

    if (!response.ok) {
      let errorMessage = `Failed to add transaction (${response.status})`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {}
      throw new Error(errorMessage);
    }

    const newTxn = await response.json();
    return mapApiTransactionToFrontend(newTxn);
  } catch (error) {
    console.error("Error adding transaction via API:", error);
    throw error;
  }
};

// ✅ Delete transaction by ID
export const deleteTransaction = async (id: string): Promise<void> => {
  if (!id) {
    console.error("⚠️ Invalid delete request: ID is undefined or empty");
    throw new Error("Invalid transaction ID");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/delete_transaction/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Failed to delete transaction (${response.status})`);
    }
  } catch (error) {
    console.error("Error deleting transaction via API:", error);
    throw error;
  }
};

// ✅ Fetch summary stats from backend
export const fetchSummary = async (): Promise<{ income: number; expense: number; balance: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/summary`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      income: data.income || 0,
      expense: data.expense || 0,
      balance: data.balance || 0,
    };
  } catch (error) {
    console.error("Error fetching summary from API:", error);
    return { income: 0, expense: 0, balance: 0 }; // fallback
  }
};

// ✅ Local fallback function to calculate totals (in case backend unavailable)
export const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, txn) => {
      if (txn.type === TransactionType.INCOME) {
        acc.income += txn.amount;
      } else {
        acc.expense += txn.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
};

// ✅ Simple local forecast generation for chart projections
export const generateForecast = (transactions: Transaction[]): ForecastData[] => {
  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);

  const recentExpenses = transactions.filter(
    (t) => t.type === TransactionType.EXPENSE && new Date(t.date) >= last30Days
  );

  const totalRecentExpense = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
  const averageDailyExpense = totalRecentExpense > 0 ? totalRecentExpense / 30 : 500;

  const forecast: ForecastData[] = [];
  for (let i = 1; i <= 7; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + i);
    forecast.push({
      name: futureDate.toLocaleDateString('en-US', { weekday: 'short' }),
      expense: Math.round(averageDailyExpense * (1 + (Math.random() - 0.5) * 0.2)), // Add ±10% variance
    });
  }
  return forecast;
};
