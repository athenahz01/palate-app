import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { getCategoryById } from '../../data/categories';

export function FirstItemCelebration({ category, item, onContinue }) {
  const cat = getCategoryById(category);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-charcoal via-stone to-charcoal flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Sparkle Animation */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-center mb-8"
        >
          <div className="text-8xl mb-4">{cat.icon}</div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles size={48} className="mx-auto text-wine" />
          </motion.div>
        </motion.div>

        {/* Message */}
        <div className="text-center text-white space-y-4 mb-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-4xl"
          >
            Your Journey Begins
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sand text-lg"
          >
            This is the first {cat.name.toLowerCase()} in your cellar
          </motion.p>

          {/* Item Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-2xl mt-6"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl"
                   style={{ backgroundColor: cat.color, color: 'white' }}>
                #1
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-serif text-xl font-bold text-charcoal">
                  {item.name || 'Your First'}
                </h3>
                {item.producer && (
                  <p className="text-slate text-sm">{item.producer}</p>
                )}
              </div>
              <div className="px-4 py-2 rounded-full bg-green-50">
                <span className="text-green-600 font-bold text-lg">10.0</span>
              </div>
            </div>
            
            <div className="border-t border-stone pt-4 mt-4">
              <p className="text-xs text-slate text-center italic">
                "Every collection starts with a single bottle. This one is yours."
              </p>
            </div>
          </motion.div>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sand text-sm mt-6"
          >
            As you add more, each will be compared to find its place.
            <br />
            Your palate profile will evolve with every pour.
          </motion.p>
        </div>

        {/* Continue Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 shadow-xl"
          style={{ backgroundColor: cat.color }}
        >
          View Your Cellar
          <ChevronRight size={20} />
        </motion.button>
      </motion.div>
    </div>
  );
}

export default FirstItemCelebration;