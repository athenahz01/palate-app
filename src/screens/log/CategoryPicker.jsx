import { motion } from 'framer-motion';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { CATEGORIES } from '../../data/categories';

export function CategoryPicker({ isOpen, onClose, userProfile, onSelect }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="font-serif text-3xl text-center mb-2">
        What are you capturing?
      </h2>
      <p className="text-center text-sm text-slate mb-8">
        📸 Scan or manually enter
      </p>

      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map((cat, index) => {
          const isProfiled = userProfile.selectedCategories.includes(cat.id);
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                onClick={() => onSelect(cat.id)}
                className="text-center relative"
              >
                {!isProfiled && (
                  <div className="absolute top-2 right-2 bg-champagne/30 text-champagne text-[10px] px-2 py-0.5 rounded font-bold">
                    NEW
                  </div>
                )}
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-bold text-base">{cat.name}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-sm text-slate mt-6">
        New categories will build their profile as you log
      </p>
    </Modal>
  );
}