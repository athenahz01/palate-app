import { motion } from 'framer-motion';

export function ProgressBar({ progress = 0 }) {
  return (
    <div className="w-full h-0.5 bg-stone mb-8">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="h-full bg-wine"
      />
    </div>
  );
}