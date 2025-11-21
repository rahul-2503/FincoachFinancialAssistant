
import React from 'react';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import ChatBot from './components/ChatBot';
import { useTransactions } from './hooks/useTransactions';
import { motion } from 'framer-motion';

const App: React.FC = () => {
  const { transactions, isLoading, error, addTransaction, deleteTransaction } = useTransactions();

  return (
    <div className="min-h-screen bg-background text-text-primary font-sans">
      <header className="bg-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-primary"
          >
            FinCoach Dashboard
          </motion.h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard 
          transactions={transactions} 
          onDeleteTransaction={deleteTransaction} 
          isLoading={isLoading} 
          error={error}
        />
      </main>
      <AddTransaction onAddTransaction={addTransaction} />
      <ChatBot />
    </div>
  );
};

export default App;
