import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CATEGORIES } from '../../data/categories';

export function CategorySelectionScreen({ onNext }) {
  const [selected, setSelected] = useState([]);

  const toggleCategory = (catId) => {
    if (selected.includes(catId)) {
      setSelected(selected.filter(id => id !== catId));
    } else {
      setSelected([...selected, catId]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-cream">
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-3xl mb-2">
            Build your first cellar
          </h2>
          <p className="text-sm text-slate">
            Start with what resonates, expand as you explore
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card
                onClick={() => toggleCategory(cat.id)}
                className={`text-center transition-all ${
                  selected.includes(cat.id)
                    ? `border-2 bg-opacity-10`
                    : 'border-2 border-transparent'
                }`}
                style={
                  selected.includes(cat.id)
                    ? {
                        borderColor: cat.color,
                        backgroundColor: `${cat.color}15`
                      }
                    : {}
                }
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <div className="font-bold text-base">{cat.name}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="pt-6"
      >
        <Button
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className="w-full"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}