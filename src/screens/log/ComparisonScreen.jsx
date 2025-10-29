import { useState } from 'react';
import { motion } from 'framer-motion';
import { getCategoryById } from '../../data/categories';

export function ComparisonScreen({ 
  category, 
  newItem,
  existingItems,
  onComplete 
}) {
  const [round, setRound] = useState(1);
  const cat = getCategoryById(category);
  const totalRounds = 2;

  const handleChoice = (choice) => {
    if (round < totalRounds) {
      setRound(round + 1);
    } else {
      // In production, you'd calculate actual ranking here
      onComplete({ rank: 2 }); // Mock rank
    }
  };

  const comparisonItem = existingItems[round - 1] || existingItems[0];

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 bg-cream">
      <div className="flex-1 flex flex-col justify-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate mb-4"
        >
          Round {round} of {totalRounds}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl text-center mb-12"
        >
          Which calls to you more?
        </motion.h2>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChoice('new')}
            className="flex-1 bg-white rounded-2xl p-6 text-center border-2 border-stone hover:border-opacity-100 transition-all"
            style={{ borderColor: cat.color }}
          >
            <div className="text-5xl mb-4">{cat.icon}</div>
            <p className="font-serif font-bold mb-2">Your New {cat.name}</p>
            <p className="text-sm text-slate">Just logged</p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChoice('existing')}
            className="flex-1 bg-white rounded-2xl p-6 text-center border-2 border-stone hover:border-opacity-100 transition-all"
            style={{ borderColor: cat.color }}
          >
            <div className="text-5xl mb-4">{cat.icon}</div>
            <p className="font-serif font-bold mb-2 truncate">
              {comparisonItem?.name || 'Existing Item'}
            </p>
            <p className="text-sm text-slate">Current #{comparisonItem?.rank || 1}</p>
          </motion.button>
        </div>
      </div>
    </div>
  );
}