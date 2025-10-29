import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { CategoryBadge } from '../../components/ui/CategoryBadge';
import { getCategoryById } from '../../data/categories';

export function SommelierScreen({ isOpen, onClose, userProfile }) {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: "Hello! I'm your personal sommelier. I know your palate - ask me anything!"
    }
  ]);
  const [input, setInput] = useState('');

  const cat = getCategoryById(userProfile.primaryCategory);

  const suggestions = [
    "What should I drink tonight?",
    "Tell me about my #1",
    "Recommend something under $40",
    "What pairs with salmon?"
  ];

  const handleSend = (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text };
    const aiResponse = {
      role: 'ai',
      text: "Based on your bold, complex palate, I'd recommend trying a peated Scotch or an aged Barolo. Both have the intensity you love!"
    };

    setMessages([...messages, userMsg, aiResponse]);
    setInput('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} position="bottom">
      <div className="flex flex-col h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-2xl">Your Sommelier</h2>
          <button
            onClick={onClose}
            className="text-3xl text-slate hover:text-charcoal transition-colors leading-none"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className="max-w-[80%] px-4 py-3 rounded-2xl font-serif"
                style={{
                  backgroundColor: msg.role === 'user' ? cat?.color || '#8B2E2E' : '#2C5F3F',
                  color: 'white'
                }}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="flex-shrink-0 px-4 py-2 rounded-full border-2 border-stone text-sm hover:border-wine hover:bg-cream transition-all whitespace-nowrap"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask anything..."
            className="flex-1 px-4 py-3 border-2 border-stone rounded-xl focus:border-wine focus:outline-none focus:ring-4 focus:ring-wine/10 transition-all"
          />
          <Button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            color={cat?.color}
          >
            Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}