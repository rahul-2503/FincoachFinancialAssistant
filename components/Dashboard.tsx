
import React, { useMemo, useState, useEffect } from 'react';
import { Transaction } from '../types';
import { generateForecast, fetchSummary } from '../services/transactionService';
import TotalsDisplay from './TotalsDisplay';
import ForecastChart from './ForecastChart';
import AdviceCard from './AdviceCard';
import TransactionList from './TransactionList';

interface DashboardProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  isLoading: boolean;
  error: string | null;
}

interface SummaryData {
    income: number;
    expense: number;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onDeleteTransaction, isLoading, error }) => {
  const [summary, setSummary] = useState<SummaryData>({ income: 0, expense: 0 });
  
  // Refetch summary data from the backend whenever the list of transactions changes
  useEffect(() => {
    const getSummary = async () => {
        const summaryData = await fetchSummary();
        setSummary(summaryData);
    };
    getSummary();
  }, [transactions]);

  const forecastData = useMemo(() => generateForecast(transactions), [transactions]);

  if (isLoading) {
    return <div className="text-center p-10 text-text-secondary animate-pulse">Loading financial data...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <TotalsDisplay income={summary.income} expense={summary.expense} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <TransactionList transactions={transactions} onDelete={onDeleteTransaction} />
        </div>
        <div className="space-y-6">
            <AdviceCard transactions={transactions} />
            <ForecastChart data={forecastData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
