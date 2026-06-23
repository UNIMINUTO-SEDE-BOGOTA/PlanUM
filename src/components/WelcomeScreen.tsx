import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight, CheckCircle, TrendingUp, Shield, PencilLine, Sparkles, Zap } from 'lucide-react';
import UpdatePlanModal from './UpdatePlanModal';

interface WelcomeScreenProps {
  onStart: () => void;
}

const features = [
  { icon: CheckCircle, text: 'Registro estructurado por secciones', color: '#008b8b' },
  { icon: TrendingUp,  text: 'Verificación inteligente con IA', color: '#d1b742' },
  { icon: Shield,      text: 'Exportación institucional en PDF', color: '#008b8b' },
];

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [showUpdate, setShowUpdate] = useState(false);
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  return (
    <div className="relative flex flex-col justify-center min-h-screen py-16 overflow-hidden w-full">

      {showUpdate && <UpdatePlanModal onClose={() => setShowUpdate(false)} />}

      {/* ─── Fondo liquid glass ─── */}
      <div className="pointer-events-none select-none absolute inset-0 overflow-hidden">
        {/* Burbuja principal - Teal */}
        <motion.div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 700,
            height: 700,
            top: -300,
            right: -200,
            background: 'radial-gradient(circle, rgba(0,139,139,0.12), rgba(0,139,139,0.02))',
          }}
          animate={{
            x: [0, 80, -40, 60, 0],
            y: [0, -60, 40, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Burbuja - Dorado */}
        <motion.div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 500,
            height: 500,
            bottom: -200,
            left: -150,
            background: 'radial-gradient(circle, rgba(209,183,66,0.10), rgba(209,183,66,0.02))',
          }}
          animate={{
            x: [0, -60, 50, -40, 0],
            y: [0, 50, -60, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Burbuja - Mezcla */}
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 350,
            height: 350,
            top: '40%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(0,139,139,0.08), rgba(209,183,66,0.06))',
          }}
          animate={{
            x: [0, 40, -30, 20, 0],
            y: [0, -30, 40, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />

        {/* Rayos de luz */}
        <motion.div
          className="absolute h-[1px] w-[200%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,139,139,0.08), rgba(209,183,66,0.12), rgba(0,139,139,0.08), transparent)',
            top: '15%',
            filter: 'blur(3px)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute h-[1px] w-[180%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(209,183,66,0.08), rgba(0,139,139,0.10), rgba(209,183,66,0.08), transparent)',
            top: '70%',
            filter: 'blur(3px)',
          }}
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
            delay: 3,
          }}
        />

        {/* Partículas flotantes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: i % 2 === 0 ? 'rgba(0,139,139,0.2)' : 'rgba(209,183,66,0.15)',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -40 - Math.random() * 60, 0],
              x: [0, 15 - Math.random() * 30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* ─── Contenido ─── */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col gap-8">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 self-start"
        >
          <motion.span 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: '#008b8b' }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs tracking-[0.22em] uppercase font-semibold" style={{ color: '#008b8b' }}>
            Sistema Inteligente del Plan Unico de Mejoras
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <h1
            className="text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight"
            style={{ color: 'var(--text-primary)', fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            Plan Único de<br />
            <span className="relative inline-block">
              <span style={{
                background: 'linear-gradient(90deg, #008b8b 0%, #d1b742 50%, #008b8b 100%)',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'gradientShift 4s ease-in-out infinite',
              }}>
                Mejoras
              </span>
              {/* Línea decorativa debajo */}
              <motion.span
                className="absolute -bottom-2 left-0 h-[3px] rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #008b8b, #d1b742, #008b8b)',
                  backgroundSize: '200% 100%',
                }}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </span>
          </h1>
          <p 
            className="text-lg leading-relaxed max-w-lg mt-4"
            style={{ color: 'var(--text-secondary)', fontFamily: "'Georgia', serif" }}
          >
            Registra, optimiza y realiza seguimiento a los planes institucionales con el soporte de inteligencia artificial.
          </p>
        </motion.div>

        {/* Features con íconos animados */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-col gap-3"
        >
          {features.map(({ icon: Icon, text, color }, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 group"
            >
              <motion.span 
                className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                style={{ 
                  backgroundColor: `${color}15`,
                  border: `1px solid ${color}30`,
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Icon size={15} style={{ color }} />
              </motion.span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* Divisor con gradiente */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="origin-left h-px"
          style={{ 
            background: 'linear-gradient(to right, #008b8b, #d1b742, transparent)',
            opacity: 0.4,
          }}
        />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-start gap-4"
        >
          {/* Botón principal */}
          <motion.button
            onClick={onStart}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-white text-base overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #008b8b 0%, #2e5871 100%)',
              boxShadow: '0 4px 24px rgba(0,139,139,0.3)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.span
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #d1b742 0%, #008b8b 100%)',
                opacity: 0,
              }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <FileText size={20} className="relative z-10" />
            <span className="relative z-10">Llenar mi plan</span>
            <motion.div
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronRight size={18} />
            </motion.div>
          </motion.button>

          {/* Botón secundario */}
          <motion.button
            onClick={() => setShowUpdate(true)}
            className="group flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,139,139,0.2)',
              color: '#008b8b',
            }}
            whileHover={{ scale: 1.02, background: isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.98 }}
          >
            <PencilLine size={17} />
            Actualizar mi plan
          </motion.button>

          {/* Badge decorativo */}
          <motion.div 
            className="flex items-center gap-3 px-5 py-4 rounded-xl"
            style={{
              border: '1px solid var(--border-color)',
              background: 'var(--bg-secondary)',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#d1b742' }}>PDI</p>
              <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>Alineado al plan</p>
            </div>
            <div className="w-px h-8" style={{ background: 'var(--border-color)' }} />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <Sparkles size={14} style={{ color: '#008b8b' }} />
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>IA</p>
              </div>
              <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>Verificación</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-xs font-light max-w-2xl"
          style={{ color: 'var(--text-muted)' }}
        >
          Este sistema está impulsado por Inteligencia Artificial (IA). Las respuestas generadas pueden contener errores o imprecisiones, por lo que se recomienda verificar la información antes de su uso o toma de decisiones.
          <br />Sistema desarrollado por la Dirección de Planeación | Corporación Universitaria Minuto de Dios - Bogotá.
        </motion.p>

      </div>

      {/* ─── Keyframes ─── */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}