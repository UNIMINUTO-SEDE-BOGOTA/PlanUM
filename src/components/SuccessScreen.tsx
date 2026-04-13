import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="flex flex-col items-center justify-center h-full text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        className="mb-8 p-6 bg-brand-blue/10 rounded-full"
      >
        <CheckCircle2 size={96} className="text-brand-blue drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
      </motion.div>
      
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">¡Muchas gracias!</h2>
      <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-xl">
        Tu plan ha sido registrado y descargado con éxito.
      </p>

      <button onClick={() => window.location.reload()} className="flex items-center gap-2 text-brand-lilac hover:text-white transition-colors border-b border-transparent hover:border-brand-lilac pb-1">
        <RotateCcw size={20} />
        Volver al inicio
      </button>
    </motion.div>
  );
}
