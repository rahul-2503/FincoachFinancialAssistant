
import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '../types';
import * as TransactionService from '../services/transactionService';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await TransactionService.fetchTransactions();
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transactions.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      await TransactionService.addTransaction(transaction);
      await refreshTransactions();
    } catch (err) {
      setError('Failed to add transaction.');
      console.error(err);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await TransactionService.deleteTransaction(id);
      await refreshTransactions();
    } catch (err) {
      setError('Failed to delete transaction.');
      console.error(err);
    }
  };

  return { transactions, isLoading, error, addTransaction, deleteTransaction, refreshTransactions };
};
