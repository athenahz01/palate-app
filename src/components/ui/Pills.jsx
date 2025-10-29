import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Pills({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-3 mt-8">
      {options.map((option, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(index)}
          className={clsx(
            'py-4 px-6 rounded-full text-base font-medium border-2 transition-all duration-200 text-center',
            value === index
              ? 'bg-wine border-wine text-white'
              : 'bg-white border-stone text-charcoal hover:border-wine hover:bg-cream'
          )}
        >
          {option}
        </motion.button>
      ))}
    </div>
  );
}