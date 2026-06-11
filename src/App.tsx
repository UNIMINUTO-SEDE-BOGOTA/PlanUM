import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import PlanForm from './components/PlanForm';
import SuccessScreen from './components/SuccessScreen';

export type AppState = 'splash' | 'welcome' | 'form' | 'success';

export interface PlanData {
  tipoPlan: string;
  año: string;
  frentePDI: string;
  nivel1: string;
  nivel2: string;
  prioridad: string;
  vicerrectoria: string;
  areaPrograma: string;
  cargoResponsable: string;
  iniciativa: string;
  indicador: string;
  lineaBase: string;
  medicion: string;
  accionMejora: string;
  meta: string;
  actividad: string;
  fechaInicio: string;
  fechaCierre: string;
  avance: string;
  evidencia: string;
  evidenciaUrl?: string;
  evidenciaUrls?: string[];
}

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

async function guardarPlan(data: PlanData): Promise<number> {
  const payload = {
    operation: 'insert',
    schema: 'pum',
    table: 'plan_um',
    data: {
      'Tipo plan':             data.tipoPlan,
      'Año':                   data.año ? Number(data.año) : null,
      'Frente PE relacionado': data.frentePDI,
      'Factor primario':       data.nivel1,
      'Factor secundario':     data.nivel2,
      'Nivel de riesgo':       data.prioridad,
      'Vicerrectoria_Escuelas':data.vicerrectoria,
      'Area':                  data.areaPrograma,
      'Cargo responsable':     data.cargoResponsable,
      'Accion de mejora':      data.accionMejora,
      'Indicador':             data.indicador,
      'Linea base':            data.lineaBase,
      'Medicion':              data.medicion,
      'Meta':                  data.meta,
      'Actividades':           data.actividad,
      'Fecha de inicio':       data.fechaInicio || null,
      'Fecha de cierre':       data.fechaCierre || null,
      'Descripcion de avance': data.avance,
      'Evidencia':             data.evidencia,
      '% de cumplimiento':     null,
    },
  };

  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error ?? `Error ${res.status} al guardar el plan`);
  }

  // El proxy devuelve el registro insertado con su ID
  return json.data[0].id as number;
}

// ── Modal de confirmación con el ID ──────────────────────────
function PlanIdModal({ id, onContinue }: { id: number; onContinue: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(String(id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md rounded-2xl p-8 flex flex-col items-center gap-6 text-center"
          style={{
            background: 'rgba(11, 22, 31, 0.98)',
            border: '1px solid rgba(0,139,139,0.35)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,139,139,0.1)',
          }}
        >
          {/* Ícono */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,139,139,0.12)', border: '1px solid rgba(0,139,139,0.3)' }}>
            <CheckCircle2 size={32} style={{ color: '#008b8b' }} />
          </div>

          {/* Título */}
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold text-white">¡Plan registrado!</h2>
            <p className="text-sm text-white/50 leading-relaxed">
              Tu plan fue guardado exitosamente. Este es tu número de plan de mejora:
            </p>
          </div>

          {/* ID grande */}
          <div className="w-full rounded-xl py-5 px-6 flex flex-col items-center gap-1"
            style={{ background: 'rgba(0,139,139,0.08)', border: '1px solid rgba(0,139,139,0.25)' }}>
            <span className="text-xs tracking-widest uppercase text-white/40 font-medium">N.º de plan</span>
            <span className="text-5xl font-bold tracking-tight" style={{ color: '#008b8b' }}>
              #{id}
            </span>
          </div>

          {/* Advertencia */}
          <div className="w-full rounded-xl p-4 flex items-start gap-3 text-left"
            style={{ background: 'rgba(225,94,41,0.08)', border: '1px solid rgba(225,94,41,0.25)' }}>
            <span className="text-lg mt-0.5">⚠️</span>
            <p className="text-xs text-orange-300/90 leading-relaxed">
              <strong className="text-orange-200">¡No pierdas este número!</strong> Lo necesitarás para 
              consultar o actualizar tu plan de mejora en el futuro.
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3 w-full">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'rgba(0,139,139,0.1)',
                border: '1px solid rgba(0,139,139,0.3)',
                color: '#008b8b',
              }}
            >
              {copied ? <><Check size={14} /> ¡Copiado!</> : <><Copy size={14} /> Copiar número</>}
            </button>
            <button
              onClick={onContinue}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #2e5871 0%, #008b8b 100%)',
                boxShadow: '0 4px 20px rgba(0,139,139,0.25)',
              }}
            >
              Ver mi plan
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── App ───────────────────────────────────────────────────────
function App() {
  const [appState, setAppState]   = useState<AppState>('splash');
  const [planData, setPlanData]   = useState<PlanData | null>(null);
  const [saving, setSaving]       = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [planId, setPlanId]       = useState<number | null>(null);
  const [showIdModal, setShowIdModal] = useState(false);

  const handleSubmit = async (data: PlanData) => {
    setSaving(true);
    setSaveError(null);
    try {
      const id = await guardarPlan(data);
      setPlanData(data);
      setPlanId(id);
      setShowIdModal(true); // muestra el modal con el ID
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al guardar.';
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleContinueFromModal = () => {
    setShowIdModal(false);
    setAppState('success');
  };

  return (
    <div
      className="min-h-screen print:min-h-0 print:block print:bg-white text-white print:text-black flex flex-col font-sans font-light relative"
      style={{ backgroundColor: '#0d1f29' }}
    >
      {/* Modal del ID — aparece encima de todo */}
      {showIdModal && planId !== null && (
        <PlanIdModal id={planId} onContinue={handleContinueFromModal} />
      )}

      {appState === 'splash' && (
        <SplashScreen onComplete={() => setAppState('welcome')} />
      )}

      {appState === 'welcome' && (
        <div className="flex-1 w-full min-h-screen">
          <WelcomeScreen onStart={() => setAppState('form')} />
        </div>
      )}

      {(appState === 'form' || appState === 'success') && (
        <main className="flex-1 overflow-y-auto p-4 md:p-12 print:p-0 w-full min-h-screen print:min-h-0">
          <div className="max-w-3xl mx-auto print:max-w-none">

            {appState === 'form' && (
              <>
                <PlanForm
                  initialData={planData}
                  onGoHome={() => { setPlanData(null); setSaveError(null); setAppState('welcome'); }}
                  onSubmit={handleSubmit}
                  saving={saving}
                />
                {saveError && (
                  <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    ⚠️ {saveError}
                  </div>
                )}
              </>
            )}

            {appState === 'success' && planData && (
              <SuccessScreen
                data={planData}
                planId={planId}
                onBack={() => setAppState('form')}
                onNew={() => { setPlanData(null); setPlanId(null); setAppState('form'); }}
              />
            )}

          </div>
        </main>
      )}
    </div>
  );
}

export default App;