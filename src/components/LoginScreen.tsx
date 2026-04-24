import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (roles: string) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [correo, setCorreo] = useState('');
  const [token, setToken] = useState('');
  const [paso, setPaso] = useState<'mail' | 'otp'>('mail');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('');

  async function handleCorreo(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Verificar en login_members (esquema logs)
      const { data, error: dbError } = await supabase
        .schema('logs')
        .from('login_members')
        .select('mail, roles')
        .eq('mail', correo)
        .maybeSingle();;

      if (dbError || !data) {
        console.error("Supabase Error:", dbError);
        setError(`Error DB: ${dbError?.message || 'Usuario no encontrado en la base de datos.'}`);
        setLoading(false);
        return;
      }

      setUserRole(data.roles || 'empleado');

      // 2. Enviar OTP
      const { error: err } = await supabase.auth.signInWithOtp({ email: correo });
      if (err) {
        setError('Ocurrió un error al enviar el código: ' + err.message);
        setLoading(false);
        return;
      }

      setPaso('otp');
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: err } = await supabase.auth.verifyOtp({
        email: correo,
        token,
        type: 'email'
      });

      if (err) {
        setError('Código inválido o ha expirado. Por favor, inténtalo de nuevo.');
        setLoading(false);
        return;
      }

      onLoginSuccess(userRole);
    } catch (err: any) {
      setError(err?.message || 'Ocurrió un error inesperado al verificar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient glow effects inside the card */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-white/90" />
              </div>
            </div>

            <h2 className="text-2xl font-light text-center mb-2 tracking-wide">
              {paso === 'mail' ? 'Acceso a la Plataforma' : 'Verificación de Seguridad'}
            </h2>
            <p className="text-white/50 text-center mb-8 text-sm font-light">
              {paso === 'mail'
                ? 'Ingresa tu correo institucional para continuar'
                : `Ingresa el código de 6 dígitos que enviamos a ${correo}`}
            </p>

            <AnimatePresence mode="wait">
              {paso === 'mail' ? (
                <motion.form
                  key="correo-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleCorreo}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                    <input
                      type="email"
                      value={correo}
                      onChange={e => setCorreo(e.target.value)}
                      placeholder="tu@empresa.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all font-light"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-400 text-sm text-center font-light pt-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !correo}
                    className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl py-4 font-light tracking-wide transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed mt-4 border border-white/5 hover:border-white/20 shadow-lg"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-white/70" />
                    ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Continuar
                      </span>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="otp-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleOtp}
                  className="space-y-4"
                >
                  <div className="relative group">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-white/80 transition-colors" />
                    <input
                      type="text"
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      placeholder="123456"
                      maxLength={6}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-center tracking-[0.5em] text-white placeholder:text-white/30 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/10 transition-all font-light"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-red-400 text-sm text-center font-light pt-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <div className="pt-4 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading || token.length < 6}
                      className="w-full bg-white/10 hover:bg-white/20 text-white rounded-2xl py-4 font-light tracking-wide transition-all duration-300 border border-white/5 hover:border-white/20 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto text-white/70" />
                      ) : (
                        'Verificar Código'
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaso('mail')}
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 text-white/50 hover:text-white/80 py-3 font-light text-sm transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Volver e intentar otro correo
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
