
import React, { useState, useEffect } from 'react';
import { getAdvice } from '../services/geminiService';
import { Transaction } from '../types';
import { motion } from 'framer-motion';

interface AdviceCardProps {
  transactions: Transaction[];
}

const AdviceCard: React.FC<AdviceCardProps> = ({ transactions }) => {
  const [advice, setAdvice] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      setIsLoading(true);
      const newAdvice = await getAdvice(transactions);
      setAdvice(newAdvice);
      setIsLoading(false);
    };

    // Debounce the call to avoid rapid firing on multiple transaction changes
    const timer = setTimeout(() => {
        if(transactions.length > 0) {
            fetchAdvice();
        } else {
            setAdvice("Add some transactions to get personalized advice!");
            setIsLoading(false);
        }
    }, 1000);

    return () => clearTimeout(timer);
  }, [transactions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card p-6 rounded-xl shadow-md mt-6"
    >
      <h3 className="text-xl font-bold text-text-primary mb-2">FinCoach Advice</h3>
      {isLoading ? (
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]"></div>
            <span className="text-text-secondary">Generating smart insights...</span>
        </div>
      ) : (
        <p className="text-text-secondary whitespace-pre-line">{advice}</p>
      )}
    </motion.div>
  );
};

export default AdviceCard;
