
import React from 'react';
import { Transaction, TransactionType } from '../types';
import TrashIcon from './icons/TrashIcon';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onDelete: (id: string) => void }> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TransactionType.INCOME;
  const amountColor = isIncome ? 'text-secondary' : 'text-red-500';

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-2 h-10 rounded-full ${isIncome ? 'bg-secondary' : 'bg-red-500'}`}></div>
        <div>
          <p className="font-semibold text-text-primary">{transaction.description}</p>
          <p className="text-sm text-text-secondary">{transaction.category} &middot; {new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className={`font-bold text-lg ${amountColor}`}>
          {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
        </p>
        <button onClick={() => onDelete(transaction.id)} className="text-text-secondary hover:text-red-500 transition-colors">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </motion.li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card p-6 rounded-xl shadow-md mt-6"
    >
      <h3 className="text-xl font-bold text-text-primary mb-4">Recent Transactions</h3>
      {transactions.length > 0 ? (
        <ul className="space-y-4">
          <AnimatePresence>
            {transactions.map(t => (
              <TransactionItem key={t.id} transaction={t} onDelete={onDelete} />
            ))}
          </AnimatePresence>
        </ul>
      ) : (
        <p className="text-text-secondary text-center py-8">No transactions yet. Add one to get started!</p>
      )}
    </motion.div>
  );
};

export default TransactionList;
