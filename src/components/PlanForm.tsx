import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useState } from 'react';
import type { PlanData } from '../App';

interface PlanFormProps {
  onSubmit: (data: PlanData) => void;
}

export default function PlanForm({ onSubmit }: PlanFormProps) {
  const [formData, setFormData] = useState<PlanData>({
    area: '',
    objetivo: '',
    problematica: '',
    acciones: '',
    descripcion: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex flex-col h-full py-2 sm:py-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-brand-lilac print:hidden">Nuevo Plan de Mejoras</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 pb-10">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Área</label>
          <select name="area" value={formData.area} onChange={handleChange} required className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all appearance-none shadow-inner">
            <option value="">Selecciona un área...</option>
            <option value="academica">Académica</option>
            <option value="administrativa">Administrativa</option>
            <option value="tecnologia">Tecnología</option>
            <option value="bienestar">Bienestar Universitario</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Objetivo</label>
          <input name="objetivo" value={formData.objetivo} onChange={handleChange} required type="text" placeholder="Ej. Mejorar la retención estudiantil..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Problemática</label>
          <textarea name="problematica" value={formData.problematica} onChange={handleChange} required rows={3} placeholder="Describe el contexto o problema a resolver..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all resize-none"></textarea>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Acciones</label>
          <textarea name="acciones" value={formData.acciones} onChange={handleChange} required rows={2} placeholder="Enumera las acciones clave..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all resize-none"></textarea>
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-400 font-medium">Descripción General</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required rows={2} placeholder="Detalles adicionales o métricas de éxito..." className="bg-black border border-brand-lilac/30 rounded-lg p-4 text-white focus:outline-none focus:border-brand-lilac focus:ring-1 focus:ring-brand-lilac transition-all resize-none"></textarea>
        </div>

        <div className="mt-4 flex justify-end print:hidden">
          <button 
            type="submit" 
            className="flex items-center gap-2 bg-brand-blue hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
          >
            <Send size={20} /> Previsualizar Plantilla
          </button>
        </div>
      </form>
    </motion.div>
  );
}
