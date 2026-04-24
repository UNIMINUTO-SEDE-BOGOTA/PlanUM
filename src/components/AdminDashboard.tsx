import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return (
    <div className="min-h-screen p-4 md:p-8 flex gap-6">
      {/* Sidebar premium glassmorphism */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-64 hidden md:flex flex-col bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden"
      >
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-purple-500/20 rounded-full blur-[60px] pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-12 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
            <LayoutDashboard className="w-5 h-5 text-white/90" />
          </div>
          <span className="font-medium tracking-wider">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2 relative z-10">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 text-white rounded-xl font-light transition-colors border border-white/5">
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white rounded-xl font-light transition-colors">
            <Users className="w-4 h-4" />
            <span>Usuarios</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-white/50 hover:bg-white/5 hover:text-white rounded-xl font-light transition-colors">
            <Settings className="w-4 h-4" />
            <span>Configuración</span>
          </button>
        </nav>

        <button 
          onClick={onLogout}
          className="mt-autow-full flex items-center gap-3 px-4 py-3 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl font-light transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Cerrar Sesión</span>
        </button>
      </motion.aside>

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1 flex flex-col gap-6"
      >
        <header className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex justify-between items-center relative overflow-hidden">
           <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
           <h1 className="text-2xl font-light tracking-wide relative z-10">Bienvenido, Administrador</h1>
           
           <button 
              onClick={onLogout}
              className="md:hidden flex items-center gap-2 text-white/50 hover:text-red-400 font-light"
            >
              <LogOut className="w-5 h-5" />
            </button>
        </header>

        <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
             <LayoutDashboard className="w-10 h-10 text-white/30" />
          </div>
          <h2 className="text-xl font-light text-white/80 mb-2">Panel Administrativo</h2>
          <p className="text-white/40 font-light max-w-md">
            Este es el entono inicial para la gestión de la plataforma. Nuevas funcionalidades se añadirán aquí.
          </p>
        </div>
      </motion.main>
    </div>
  );
}
