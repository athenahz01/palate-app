import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export function WelcomeScreen({ onNext }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-cream">
      <div className="flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <h1 className="font-serif text-[64px] text-wine tracking-tight">
            P
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="font-serif text-4xl leading-tight text-center max-w-xs">
            Taste is personal.<br />Let's learn yours.
          </h2>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="w-full max-w-sm pb-8"
      >
        <Button onClick={onNext} className="w-full">
          Begin
        </Button>
      </motion.div>
    </div>
  );
}