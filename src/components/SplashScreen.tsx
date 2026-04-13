import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-dark">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="text-center"
      >
        <motion.h1 
          className="text-7xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-brand-lilac to-brand-purple bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(216,180,254,0.3)]"
        >
          Plan UM+
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-2xl md:text-3xl font-light text-gray-300"
        >
          Plan Único de Mejoras
        </motion.p>
      </motion.div>
    </div>
  );
}
