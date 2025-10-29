import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { RadarChart } from '../../components/RadarChart';
import { getCategoryById } from '../../data/categories';
import { generateInitialRadar } from '../../utils/radarCalculations';

export function PalateRevealScreen({ quizData, onNext }) {
  const { category, selectedCategories, answers } = quizData;
  
  // Add safety check
  if (!category) {
    console.error('No category found in quizData:', quizData);
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-center text-slate">Loading your palate...</p>
      </div>
    );
  }

  const cat = getCategoryById(category);
  
  // Add another safety check
  if (!cat) {
    console.error('Category not found:', category);
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-center text-slate">Error loading category...</p>
      </div>
    );
  }

  const hasMultiple = selectedCategories && selectedCategories.length > 1;

  // Generate initial radar data from quiz answers
  const radarData = generateInitialRadar(answers, cat.radarAttributes);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-cream">
      <div className="flex-1 flex flex-col justify-center items-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-serif text-slate mb-4"
        >
          Your Signature
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl mb-4"
        >
          {cat.icon}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-3xl mb-8 text-center"
          style={{ color: cat.color }}
        >
          {cat.name} Palate
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <RadarChart
            data={radarData}
            attributes={cat.radarAttributes}
            color={cat.color}
            size={240}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-slate max-w-xs mb-4">
            Your {cat.name.toLowerCase()} profile will evolve as you taste and curate your collection.
          </p>

          {hasMultiple && (
            <div className="inline-block bg-stone/30 px-5 py-3 rounded-full">
              <p className="text-sm text-slate">
                + {selectedCategories.length - 1} more {selectedCategories.length === 2 ? 'category' : 'categories'} to profile later
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full max-w-sm pb-8"
      >
        <Button onClick={onNext} className="w-full">
          Enter Your Cellar
        </Button>
      </motion.div>
    </div>
  );
}