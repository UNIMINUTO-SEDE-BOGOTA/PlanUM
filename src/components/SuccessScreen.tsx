import { motion } from 'framer-motion';
import { RotateCcw, Printer } from 'lucide-react';
import type { PlanData } from '../App';

interface SuccessScreenProps {
  data: PlanData;
  onBack: () => void;
}

export default function SuccessScreen({ data, onBack }: SuccessScreenProps) {
  const handlePrint = () => {
    window.print();
  };

  const getAreaLabel = (area: string) => {
    const map: Record<string, string> = {
      academica: "Académica",
      administrativa: "Administrativa",
      tecnologia: "Tecnología",
      bienestar: "Bienestar Universitario"
    };
    return map[area] || area;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full items-center max-h-screen overflow-y-auto w-full pb-20"
    >
      <div className="w-full flex justify-between items-center mb-6 print:hidden">
        <button onClick={onBack} className="flex items-center gap-2 text-brand-lilac hover:text-white transition-colors">
          <RotateCcw size={20} />
          Volver a editar
        </button>
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-brand-blue hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
        >
          <Printer size={20} /> Imprimir / Guardar PDF
        </button>
      </div>

      {/* Printable Document Container */}
      <div className="w-full max-w-3xl bg-white text-gray-900 rounded-xl shadow-2xl p-8 md:p-12 print:p-0 print:shadow-none print:bg-transparent overflow-hidden relative">
        {/* Header styling specifically for print and visual template */}
        <div className="border-b-4 border-brand-purple pb-6 mb-8 print:border-black">
          <h1 className="text-3xl font-bold text-brand-dark print:text-black mb-2">Plan de Mejoramiento Institucional</h1>
          <p className="text-gray-500 print:text-gray-700">Documento de seguimiento y control</p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:border-gray-300 print:bg-white">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Área Responsable</h3>
              <p className="text-lg font-semibold text-gray-800">{getAreaLabel(data.area)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 print:border-gray-300 print:bg-white">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 print:text-gray-600">Fecha de Creación</h3>
              <p className="text-lg font-semibold text-gray-800">{new Date().toLocaleDateString('es-CO')}</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 print:border-gray-400">
            <h3 className="text-sm font-bold text-brand-purple uppercase tracking-wider mb-2 print:text-black">Objetivo Principal</h3>
            <p className="text-gray-800 text-lg">{data.objetivo}</p>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 print:border-gray-400">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 print:text-black">Análisis del Contexto</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2 border-l-2 border-red-400 pl-3">Problemática Identificada</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{data.problematica}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-2 border-l-2 border-brand-blue pl-3">Acciones Estratégicas</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{data.acciones}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2 border-l-2 border-green-400 pl-3">Descripción General</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{data.descripcion}</p>
            </div>
          </div>
        </div>

        {/* Footer for print only */}
        <div className="mt-12 pt-8 border-t border-gray-200 print:border-gray-400 hidden print:block text-center space-y-16">
          <div className="flex justify-around">
            <div className="w-1/3">
              <div className="border-b border-black mb-2"></div>
              <p className="text-xs text-gray-600">Firma Responsable de Área</p>
            </div>
            <div className="w-1/3">
              <div className="border-b border-black mb-2"></div>
              <p className="text-xs text-gray-600">Firma Aprobación</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Generado a través de ECAPI - Sistema de Gestión Inteligente</p>
        </div>
      </div>
    </motion.div>
  );
}
