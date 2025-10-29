import { motion } from 'framer-motion';

export function LoadingSpinner({ message = 'Loading...', progress = null }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-wine border-t-transparent rounded-full mb-4"
      />
      <p className="text-charcoal font-medium">{message}</p>
      {progress !== null && (
        <p className="text-slate text-sm mt-2">{progress}%</p>
      )}
    </div>
  );
}