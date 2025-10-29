import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';

export function PhilosophyScreen({ onNext }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-cream">
      <div className="flex-1 flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 relative w-32 h-32"
        >
          <div className="absolute inset-0 w-20 h-20 rounded-full border border-wine/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 w-10 h-10 rounded-full bg-wine/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <p className="font-serif text-xl text-slate mb-4">
            Not ratings. Not reviews.
          </p>
          <h2 className="font-serif text-3xl leading-tight">
            Just your palate,<br />expressed beautifully.
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
          Continue
        </Button>
      </motion.div>
    </div>
  );
}