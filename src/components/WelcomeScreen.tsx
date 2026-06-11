import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, CheckCircle, TrendingUp, Shield, PencilLine } from 'lucide-react';
import UpdatePlanModal from './UpdatePlanModal';

interface WelcomeScreenProps {
  onStart: () => void;
}

const features = [
  { icon: CheckCircle, text: 'Registro estructurado por secciones' },
  { icon: TrendingUp,  text: 'Verificación inteligente con IA' },
  { icon: Shield,      text: 'Exportación institucional en PDF' },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <div className="relative flex flex-col justify-center min-h-screen py-16 overflow-hidden w-full">

      {/* Modal de actualización */}
      {showUpdate && <UpdatePlanModal onClose={() => setShowUpdate(false)} />}

      {/* ── Fondo geométrico ── */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 60% 20%, #2e5871 0%, #0d1f29 55%, #050e14 100%)' }} />
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #008b8b 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #e15e29 0%, transparent 70%)' }} />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#008b8b" strokeWidth="0.8"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute top-0 right-[28%] w-px h-full opacity-10"
          style={{ background: 'linear-gradient(to bottom, transparent, #008b8b 30%, #d1b742 70%, transparent)' }} />
      </div>

      {/* ── Contenido ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 flex flex-col gap-10">

        {/* Badge institucional */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 self-start"
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#008b8b' }} />
          <span className="text-xs tracking-[0.22em] uppercase font-semibold" style={{ color: '#008b8b' }}>
            Sistema Inteligente del Plan Unico de Mejoras
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1
            className="text-5xl md:text-6xl font-bold leading-[1.08] tracking-tight text-white mb-4"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Plan Único de<br />
            <span style={{
              background: 'linear-gradient(90deg, #008b8b 0%, #d1b742 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Mejoras
            </span>
          </h1>
          <p className="text-lg text-slate-300 font-light leading-relaxed max-w-lg"
            style={{ fontFamily: "'Georgia', serif" }}>
            Registra, optimiza y realiza seguimiento a los planes institucionales con el soporte de inteligencia artificial.
          </p>
        </motion.div>

        {/* Features */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col gap-3"
        >
          {features.map(({ icon: Icon, text }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
                style={{ backgroundColor: 'rgba(0,139,139,0.15)', border: '1px solid rgba(0,139,139,0.3)' }}>
                <Icon size={14} style={{ color: '#008b8b' }} />
              </span>
              <span className="text-sm text-slate-300 font-light">{text}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Divisor */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="origin-left h-px"
          style={{ background: 'linear-gradient(to right, #2e5871, #008b8b40, transparent)' }}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          {/* Botón principal: Llenar plan */}
          <button
            onClick={onStart}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-base overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #e15e29 0%, #c94d1a 100%)',
              boxShadow: '0 0 0 1px rgba(225,94,41,0.4), 0 8px 32px rgba(225,94,41,0.3)',
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'linear-gradient(135deg, #f07040 0%, #e15e29 100%)' }} />
            <FileText size={20} className="relative z-10 group-hover:rotate-3 transition-transform duration-300" />
            <span className="relative z-10">Llenar mi plan</span>
            <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
          </button>

          {/* Botón secundario: Actualizar por ID */}
          <button
            onClick={() => setShowUpdate(true)}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'rgba(0,139,139,0.08)',
              border: '1px solid rgba(0,139,139,0.35)',
              color: '#008b8b',
              boxShadow: '0 4px 20px rgba(0,139,139,0.1)',
            }}
          >
            <PencilLine size={17} className="group-hover:rotate-3 transition-transform duration-300" />
            Actualizar mi plan
          </button>

          {/* Stat decorativa */}
          <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
            style={{ border: '1px solid rgba(46,88,113,0.5)', background: 'rgba(46,88,113,0.12)' }}>
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#d1b742' }}>PDI</p>
              <p className="text-[10px] tracking-widest uppercase text-slate-500 mt-0.5">Alineado al plan</p>
            </div>
            <div className="w-px h-8 bg-slate-700" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">IA</p>
              <p className="text-[10px] tracking-widest uppercase text-slate-500 mt-0.5">Verificación</p>
            </div>
          </div>
        </motion.div>

        {/* Nota de pie */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.5 }}
          className="text-xs text-slate-600 font-light"
        >
          Este sistema está impulsado por Inteligencia Artificial (IA). Las respuestas generadas pueden contener errores o imprecisiones, por lo que se recomienda verificar la información antes de su uso o toma de decisiones.
          <br />Sistema desarrollado por la Dirección de Planeación | Corporación Universitaria Minuto de Dios - Bogotá.
        </motion.p>

      </div>
    </div>
  );
}