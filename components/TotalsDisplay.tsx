
import React from 'react';
import { motion } from 'framer-motion';

interface TotalsDisplayProps {
  income: number;
  expense: number;
}

const StatCard: React.FC<{ title: string; amount: number; color: string }> = ({ title, amount, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card p-6 rounded-xl shadow-md flex-1 min-w-[200px]"
    >
      <h3 className="text-text-secondary text-md font-medium">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>
        ₹{amount.toLocaleString('en-IN')}
      </p>
    </motion.div>
  );
};

const TotalsDisplay: React.FC<TotalsDisplayProps> = ({ income, expense }) => {
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Total Income" amount={income} color="text-secondary" />
      <StatCard title="Total Expenses" amount={expense} color="text-red-500" />
      <StatCard title="Net Balance" amount={balance} color={balance >= 0 ? 'text-primary' : 'text-red-500'} />
    </div>
  );
};

export default TotalsDisplay;
