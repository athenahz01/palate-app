import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Slider({ 
  leftLabel, 
  rightLabel, 
  value, 
  onChange 
}) {
  const values = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="py-8">
      <div className="flex justify-between mb-4 px-2">
        <span className="text-sm text-slate text-center flex-1">{leftLabel}</span>
        <span className="text-sm text-slate text-center flex-1">{rightLabel}</span>
      </div>
      <div className="flex justify-between items-center">
        {values.map((val) => (
          <motion.button
            key={val}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(val)}
            className={clsx(
              'w-12 h-12 rounded-full border-2 transition-all duration-200',
              value === val
                ? 'bg-wine border-wine'
                : 'bg-white border-stone hover:border-wine'
            )}
          />
        ))}
      </div>
    </div>
  );
}