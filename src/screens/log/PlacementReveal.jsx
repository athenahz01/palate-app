import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { getCategoryById } from '../../data/categories';

export function PlacementReveal({ category, rank, onClose }) {
  const cat = getCategoryById(category);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-cream">
      <div className="flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-7xl mb-8"
        >
          {cat.icon}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-3xl text-center mb-6"
        >
          Placed in Your Collection
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 py-3 rounded-full text-2xl font-bold mb-8"
          style={{
            backgroundColor: `${cat.color}20`,
            color: cat.color
          }}
        >
          #{rank}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-slate text-center mb-4"
        >
          Among your treasured {cat.name.toLowerCase()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="rounded-xl p-4 text-center"
          style={{ backgroundColor: `${cat.color}15` }}
        >
          <p className="text-sm" style={{ color: cat.color }}>
            ✨ Your {cat.name} palate is evolving
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="w-full max-w-sm pb-8"
      >
        <Button onClick={onClose} color={cat.color} className="w-full">
          View Collection
        </Button>
      </motion.div>
    </div>
  );
}