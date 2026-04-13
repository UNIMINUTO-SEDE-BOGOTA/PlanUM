import { motion } from 'framer-motion';
import { FileText, HelpCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center flex-1 text-center"
    >
      <h1 className="text-4xl md:text-5xl font-extralight leading-relaxed mb-6 text-white tracking-wide">
        Bienvenido al<br />
        <span className="font-light">
          Plan Único de Mejoras
        </span>
      </h1>

      <p className="text-gray-300 font-light text-lg md:text-xl mb-14 max-w-2xl px-4">
        Registra, optimiza y realiza seguimiento a los planes con el soporte de nuestra inteligencia artificial
      </p>

      <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto px-4">
        <button
          onClick={onStart}
          className="group flex items-center justify-center gap-3 px-10 py-4 bg-brand-blue/90 hover:bg-brand-blue transition-all rounded-full font-light tracking-wide text-lg text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        >
          <FileText size={22} className="group-hover:scale-110 transition-transform font-light" />
          Llenar mi plan
        </button>

        <button className="flex items-center justify-center gap-3 px-8 py-4 border border-brand-lilac/30 text-brand-lilac hover:text-white hover:bg-brand-lilac/10 transition-all rounded-full font-light tracking-wide text-lg">
          <HelpCircle size={22} />
          ¿Cómo lo lleno?
        </button>
      </div>
    </motion.div>
  );
}
