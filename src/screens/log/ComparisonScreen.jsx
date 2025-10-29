import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import { selectComparisonItems, calculateRankFromComparisons } from '../../utils/rankingSystem';

/**
 * ComparisonScreen - Beli-style comparative ranking
 * User compares new item against existing items
 */
export function ComparisonScreen({ 
  newItem, 
  existingItems, 
  category,
  onComplete, 
  onBack 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [comparisons, setComparisons] = useState([]);
  const [itemsToCompare, setItemsToCompare] = useState([]);

  useEffect(() => {
    // Select which items to compare against
    const sorted = [...existingItems].sort((a, b) => a.rank - b.rank);
    const selected = selectComparisonItems(sorted);
    setItemsToCompare(selected);
  }, [existingItems]);

  const currentComparison = itemsToCompare[currentIndex];
  const totalComparisons = itemsToCompare.length;
  const progress = ((currentIndex + 1) / totalComparisons) * 100;

  const handleChoice = (preferNew) => {
    const result = {
      comparedWith: currentComparison.id,
      preferNew
    };

    setComparisons([...comparisons, result]);
    
    if (preferNew) {
      setWins(wins + 1);
    } else {
      setLosses(losses + 1);
    }

    // Move to next comparison or finish
    if (currentIndex < totalComparisons - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // All comparisons complete
      const newRank = calculateRankFromComparisons(
        { wins: wins + (preferNew ? 1 : 0), losses: losses + (preferNew ? 0 : 1), itemsCompared: totalComparisons },
        existingItems
      );
      onComplete({
        rank: newRank,
        wins: wins + (preferNew ? 1 : 0),
        losses: losses + (preferNew ? 0 : 1)
      });
    }
  };

  const handleSkip = () => {
    if (currentIndex < totalComparisons - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // If user skips last one, estimate rank from what we have
      const newRank = wins > losses ? 
        Math.max(1, Math.ceil(existingItems.length * 0.3)) : 
        Math.ceil(existingItems.length * 0.7);
      onComplete({ rank: newRank, wins, losses });
    }
  };

  if (itemsToCompare.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-charcoal z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone">
        <button onClick={onBack} className="text-white p-2">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-xs text-sand mb-1">
            Comparison {currentIndex + 1} of {totalComparisons}
          </p>
          <div className="w-full max-w-xs mx-auto bg-stone h-1 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-wine"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <button onClick={onBack} className="text-white p-2">
          <X size={24} />
        </button>
      </div>

      {/* Comparison Cards */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="text-white text-xl mb-8 text-center">
          Which do you prefer?
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md space-y-4"
          >
            {/* New Item Card */}
            <motion.button
              onClick={() => handleChoice(true)}
              className="w-full bg-wine text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform"
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-sm text-sand mb-2">NEW</div>
              <h3 className="font-serif text-2xl font-bold mb-1">{newItem.name}</h3>
              {newItem.producer && (
                <p className="text-sand text-sm">{newItem.producer}</p>
              )}
              {newItem.vintage && (
                <p className="text-sand text-xs mt-2">{newItem.vintage}</p>
              )}
            </motion.button>

            <div className="text-center text-sand text-sm py-2">vs</div>

            {/* Existing Item Card */}
            <motion.button
              onClick={() => handleChoice(false)}
              className="w-full bg-stone text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-transform"
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-sm text-sand mb-2">#{currentComparison.rank}</div>
              <h3 className="font-serif text-2xl font-bold mb-1">{currentComparison.name}</h3>
              {currentComparison.producer && (
                <p className="text-sand text-sm">{currentComparison.producer}</p>
              )}
              {currentComparison.score && (
                <div className="mt-3 inline-block px-3 py-1 bg-charcoal rounded-full text-xs">
                  Score: {currentComparison.score.toFixed(1)}
                </div>
              )}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Skip Button */}
      <div className="p-6">
        <button
          onClick={handleSkip}
          className="w-full text-sand text-sm py-3 hover:text-white transition-colors"
        >
          Too tough to decide? Skip
        </button>
      </div>
    </div>
  );
}

export default ComparisonScreen;