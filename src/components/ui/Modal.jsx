import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export function Modal({ isOpen, onClose, children, position = 'bottom' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const positions = {
    bottom: 'items-end justify-center',
    center: 'items-center justify-center'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`fixed inset-0 bg-black/60 flex ${positions[position]} z-50 backdrop-blur-sm`}
        >
          <motion.div
            initial={position === 'bottom' ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            animate={position === 'bottom' ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={position === 'bottom' ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`bg-white w-full max-w-md max-h-[90vh] overflow-y-auto p-8 ${
              position === 'bottom' ? 'rounded-t-3xl' : 'rounded-3xl'
            }`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}