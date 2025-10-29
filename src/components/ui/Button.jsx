import { motion } from 'framer-motion';
import clsx from 'clsx';

export function Button({ 
  children, 
  variant = 'primary', 
  color,
  disabled, 
  onClick, 
  className,
  ...props 
}) {
  const baseStyles = 'px-12 py-4 rounded-full font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: color 
      ? `text-white shadow-lg active:scale-95`
      : 'bg-wine text-white shadow-lg hover:bg-wine/90 active:scale-95',
    secondary: 'bg-white text-slate border-2 border-stone hover:border-wine hover:text-wine'
  };

  const style = color ? { backgroundColor: color } : {};

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={clsx(baseStyles, variants[variant], className)}
      disabled={disabled}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </motion.button>
  );
}