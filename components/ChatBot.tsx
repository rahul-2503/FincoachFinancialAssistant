import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getChatResponse } from '../services/geminiService';
import ChatIcon from './icons/ChatIcon';
import SendIcon from './icons/SendIcon';
// FIX: Import `Variants` type to correctly type the animation variants.
import { motion, AnimatePresence, Variants } from 'framer-motion';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm FinCoach. How can I help you with your finances today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiResponseText = await getChatResponse([...messages, userMessage], inputValue);
    const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  // FIX: Explicitly type `chatWindowVariants` with `Variants` to resolve TypeScript error with framer-motion.
  const chatWindowVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, y: 50, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-secondary text-white p-4 rounded-full shadow-lg hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-transform transform hover:scale-110"
        aria-label="Toggle FinCoach chatbot"
      >
        <ChatIcon className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-24 right-6 w-[calc(100%-3rem)] sm:w-96 h-[60vh] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            <div className="p-4 bg-secondary text-white font-bold text-center">
              FinCoach Assistant
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-text-primary rounded-bl-none'}`}>
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                   <div className="flex justify-start">
                     <div className="max-w-[80%] p-3 rounded-2xl bg-gray-200 text-text-primary rounded-bl-none flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-text-secondary animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-text-secondary animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-text-secondary animate-pulse [animation-delay:0.4s]"></div>
                     </div>
                   </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 flex items-center space-x-2 bg-white">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask FinCoach..."
                className="flex-1 border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button type="submit" className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 disabled:bg-gray-400 transition-colors" disabled={isLoading}>
                <SendIcon className="w-5 h-5"/>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;