import { motion } from 'framer-motion';
import { Send, FileDown } from 'lucide-react';
import { useState } from 'react';

interface PlanFormProps {
  onSubmit: () => void;
}

export default function PlanForm({ onSubmit }: PlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate loading/download
    setTimeout(() => {
      onSubmit();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full py-2 sm:py-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-brand-lilac">Nuevo Plan de Mejoras</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 pb-10">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Área</label>
          <select required className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all appearance-none shadow-inner">
            <option value="">Selecciona un área...</option>
            <option value="academica">Académica</option>
            <option value="administrativa">Administrativa</option>
            <option value="tecnologia">Tecnología</option>
            <option value="bienestar">Bienestar Universitario</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Objetivo</label>
          <input required type="text" placeholder="Ej. Mejorar la retención estudiantil..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Problemática</label>
          <textarea required rows={3} placeholder="Describe el contexto o problema a resolver..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all resize-none"></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Acciones</label>
          <textarea required rows={2} placeholder="Enumera las acciones clave..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all resize-none"></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Descripción General</label>
          <textarea required rows={2} placeholder="Detalles adicionales o métricas de éxito..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all resize-none"></textarea>
        </div>

        <div className="mt-4 flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-brand-blue hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-70 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><FileDown size={20} /></motion.div> Procesando...</span>
            ) : (
              <><Send size={20} /> Guardar y Descargar</>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
