import { motion } from 'framer-motion';
import clsx from 'clsx';

export function CategoryBadge({ 
  icon, 
  name, 
  active, 
  onClick,
  color = '#8B2E2E'
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 whitespace-nowrap',
        active 
          ? 'text-white' 
          : 'bg-white text-charcoal border-stone hover:bg-cream'
      )}
      style={active ? { 
        backgroundColor: color, 
        borderColor: color 
      } : {}}
    >
      <span className="text-lg">{icon}</span>
      <span>{name}</span>
    </motion.button>
  );
}