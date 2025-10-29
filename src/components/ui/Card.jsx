import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Card({ 
  children, 
  onClick, 
  className,
  hover = true,
  ...props 
}) {
  const baseStyles = 'bg-white rounded-2xl p-6 shadow-md transition-all duration-300';
  
  return (
    <motion.div
      whileHover={hover && onClick ? { scale: 1.02, y: -2, boxShadow: '0 12px 24px rgba(42, 42, 42, 0.12)' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={clsx(baseStyles, onClick && 'cursor-pointer', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
}