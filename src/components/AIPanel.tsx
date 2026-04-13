import { motion } from 'framer-motion';
import { Sparkles, Bot } from 'lucide-react';

export default function AIPanel() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="hidden lg:flex w-96 flex-col border-l border-brand-purple/30 bg-[#16082e]/60 backdrop-blur-xl relative z-20"
    >
      <div className="p-8 flex flex-col h-full relative overflow-hidden">
        {/* Glow effect inside panel */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-lilac/5 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-brand-dark/50 border border-brand-lilac/20 rounded-xl shadow-[0_0_15px_rgba(216,180,254,0.1)]">
            <Bot className="text-brand-lilac" size={28} />
          </div>
          <h3 className="text-xl font-semibold bg-gradient-to-r from-brand-lilac to-white bg-clip-text text-transparent">Asistente IA</h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.7, 1, 0.7],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-8 text-brand-lilac/40 relative"
          >
            <div className="absolute inset-0 bg-brand-lilac/20 blur-xl rounded-full"></div>
            <Sparkles size={56} className="relative z-10" />
          </motion.div>

          <p className="text-lg text-gray-300 font-light leading-relaxed">
            En este espacio obtendrás sugerencias de nuestra <span className="font-semibold text-brand-lilac">IA</span> para ayudarte con el registro de tu plan de mejora.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
