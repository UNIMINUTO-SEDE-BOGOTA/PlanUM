import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3200);

    // Animación de progreso
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 28);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  const isLight = document.documentElement.getAttribute('data-theme') === 'light';

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* ─── Fondo liquid glass ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Burbuja 1 - Teal */}
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 600,
            height: 600,
            top: -200,
            left: -200,
            background: 'radial-gradient(circle, rgba(0,139,139,0.25), rgba(0,139,139,0.05))',
          }}
          animate={{
            x: [0, 100, -50, 80, 0],
            y: [0, -80, 50, -30, 0],
            scale: [1, 1.1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Burbuja 2 - Dorado */}
        <motion.div
          className="absolute rounded-full blur-[100px]"
          style={{
            width: 450,
            height: 450,
            bottom: -150,
            right: -150,
            background: 'radial-gradient(circle, rgba(209,183,66,0.20), rgba(209,183,66,0.04))',
          }}
          animate={{
            x: [0, -80, 60, -40, 0],
            y: [0, 60, -70, 40, 0],
            scale: [1, 0.9, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Burbuja 3 - Teal/Dorado mezcla */}
        <motion.div
          className="absolute rounded-full blur-[120px]"
          style={{
            width: 350,
            height: 350,
            top: '30%',
            left: '40%',
            background: 'radial-gradient(circle, rgba(0,139,139,0.12), rgba(209,183,66,0.08))',
          }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -40, 60, -20, 0],
            scale: [1, 1.2, 0.8, 1.1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* ─── Rayos de luz líquida ─── */}
        <motion.div
          className="absolute h-[2px] w-[300%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,139,139,0.15), rgba(209,183,66,0.20), rgba(0,139,139,0.15), transparent)',
            top: '20%',
            filter: 'blur(4px)',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute h-[2px] w-[250%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(209,183,66,0.12), rgba(0,139,139,0.18), rgba(209,183,66,0.12), transparent)',
            top: '50%',
            filter: 'blur(4px)',
          }}
          animate={{
            x: ['100%', '-100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
            delay: 2,
          }}
        />

        <motion.div
          className="absolute h-[2px] w-[280%]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0,139,139,0.10), rgba(209,183,66,0.15), rgba(0,139,139,0.10), transparent)',
            top: '75%',
            filter: 'blur(4px)',
          }}
          animate={{
            x: ['-80%', '100%'],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
            delay: 4,
          }}
        />

        {/* ─── Partículas flotantes ─── */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: i % 2 === 0 ? 'rgba(0,139,139,0.3)' : 'rgba(209,183,66,0.25)',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              filter: 'blur(2px)',
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              x: [0, 10 - Math.random() * 20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* ─── Contenido principal ─── */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo / Icono */}
        <motion.div
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.2,
          }}
          className="mb-6"
        >
          <div className="relative">
            {/* Anillo exterior */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '2px solid rgba(0,139,139,0.15)',
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            
            {/* Círculo principal */}
            <div 
              className="relative w-28 h-28 rounded-2xl flex items-center justify-center"
              style={{
                background: isLight 
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,139,139,0.2)',
                boxShadow: '0 8px 32px rgba(0,139,139,0.15)',
              }}
            >
              <span className="text-5xl">📋</span>
            </div>
          </div>
        </motion.div>

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h1 
            className="text-6xl md:text-8xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #008b8b 0%, #d1b742 50%, #008b8b 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'gradientShift 3s ease-in-out infinite',
            }}
          >
            Plan UM+
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-xl md:text-2xl font-light mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Plan Único de Mejoras
          </motion.p>
        </motion.div>

        {/* Barra de progreso líquida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-12 w-64 max-w-[80%]"
        >
          <div 
            className="relative h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--border-color)' }}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #008b8b, #d1b742, #008b8b)',
                backgroundSize: '200% 100%',
              }}
              animate={{
                x: ['-100%', '0%'],
                backgroundPosition: ['0% 0%', '200% 0%'],
              }}
              transition={{
                duration: 1.8,
                ease: 'easeInOut',
              }}
            />
          </div>
          
          <motion.p
            className="text-xs text-center mt-2 font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            {progress}%
          </motion.p>
        </motion.div>

        {/* Subtítulo con efecto shimmer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="text-xs mt-6 tracking-[0.3em] uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          <span className="inline-block bg-gradient-to-r from-[#008b8b] via-[#d1b742] to-[#008b8b] bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
            Sistema Inteligente del Plan Unico de Mejoras
          </span>
        </motion.p>
      </div>

      {/* ─── Keyframes adicionales ─── */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0%; }
          100% { background-position: 200% 0%; }
        }
        .animate-shimmer {
          animation: shimmer 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}