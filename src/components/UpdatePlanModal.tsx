import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;
const ANON_KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

interface PlanRecord {
  id: number;
  'Tipo plan'?: string;
  'Accion de mejora'?: string;
  'Meta'?: string;
  'Actividades'?: string;
  'Medicion'?: string;
  'Cargo responsable'?: string;
  'Vicerrectoria_Escuelas'?: string;
}

interface UpdatePlanModalProps {
  onClose: () => void;
}

type ModalStep = 'search' | 'edit' | 'success';

export default function UpdatePlanModal({ onClose }: UpdatePlanModalProps) {
  const [step, setStep]         = useState<ModalStep>('search');
  const [idInput, setIdInput]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [plan, setPlan]         = useState<PlanRecord | null>(null);
  const [medicion, setMedicion] = useState('');

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
  };

  const handleSearch = async () => {
    const id = Number(idInput.trim());
    if (!id || isNaN(id)) {
      setError('Ingresa un número de plan válido.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          operation: 'select',
          schema: 'pum',
          table: 'plan_um',
          match: { id },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error al buscar el plan.');
      if (!json.data || json.data.length === 0) throw new Error(`No se encontró ningún plan con el ID #${id}.`);
      const found = json.data[0] as PlanRecord;
      setPlan(found);
      setMedicion(found['Medicion'] ?? '');
      setStep('edit');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!plan) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          operation: 'update',
          schema: 'pum',
          table: 'plan_um',
          match: { id: plan.id },
          data: { 'Medicion': medicion },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Error al actualizar.');
      setStep('success');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm
    placeholder:text-white/30 focus:outline-none focus:border-[#008b8b]/60 focus:ring-1 focus:ring-[#008b8b]/30
    transition-all hover:border-white/20`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto px-4 py-8"
        style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="flex min-h-full items-center justify-center">
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="w-full max-w-lg rounded-2xl flex flex-col"
            style={{
              background: 'rgba(11, 22, 31, 0.98)',
              border: '1px solid rgba(0,139,139,0.35)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <h2 className="text-base font-bold text-white">Actualizar plan de mejora</h2>
                <p className="text-xs text-white/40 mt-0.5">
                  {step === 'search' ? 'Ingresa el número de tu plan para buscarlo'
                    : step === 'edit' ? `Plan #${plan?.id} encontrado`
                    : 'Plan actualizado exitosamente'}
                </p>
              </div>
              <button onClick={onClose}
                className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <X size={16} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">

              {/* ── STEP: SEARCH ── */}
              {step === 'search' && (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-widest uppercase text-white/40 font-medium">
                      Número de plan
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={idInput}
                        onChange={e => { setIdInput(e.target.value); setError(null); }}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Ej. 142"
                        className={inputCls}
                      />
                      <button
                        onClick={handleSearch}
                        disabled={loading || !idInput.trim()}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all
                          bg-[#008b8b]/10 text-[#008b8b] border border-[#008b8b]/30 hover:bg-[#008b8b]/20
                          disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {loading
                          ? <Loader2 size={15} className="animate-spin" />
                          : <Search size={15} />}
                        Buscar
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-amber-300/80">
                        El número de plan te fue asignado al momento de registrarlo.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* ── STEP: EDIT ── */}
              {step === 'edit' && plan && (
                <>
                  <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs tracking-widest uppercase text-white/40 font-medium mb-1">
                      Información del plan
                    </p>
                    {[
                      { label: 'Tipo de plan',      value: plan['Tipo plan'] },
                      { label: 'Vicerrectoría',     value: plan['Vicerrectoria_Escuelas'] },
                      { label: 'Cargo responsable', value: plan['Cargo responsable'] },
                      { label: 'Acción de mejora',  value: plan['Accion de mejora'] },
                      { label: 'Meta',              value: plan['Meta'] },
                    ].map(({ label, value }) => value ? (
                      <div key={label} className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase tracking-wider text-white/30">{label}</span>
                        <span className="text-xs text-white/70 leading-relaxed">{value}</span>
                      </div>
                    ) : null)}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs tracking-widest uppercase font-medium" style={{ color: '#008b8b' }}>
                      Medición — campo editable
                    </label>
                    <textarea
                      rows={3}
                      value={medicion}
                      onChange={e => setMedicion(e.target.value)}
                      placeholder="Ej. Semestral / Trimestral / Porcentaje alcanzado..."
                      className={`${inputCls} resize-none border-[#008b8b]/30 focus:border-[#008b8b]/60`}
                    />
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-red-400">{error}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => { setStep('search'); setError(null); }}
                      className="flex-1 py-3 rounded-xl text-sm font-medium transition-all
                        bg-white/5 text-white/50 border border-white/10 hover:text-white hover:bg-white/10"
                    >
                      Volver
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all
                        hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #2e5871 0%, #008b8b 100%)',
                        boxShadow: '0 4px 20px rgba(0,139,139,0.25)',
                      }}
                    >
                      {saving
                        ? <><Loader2 size={14} className="animate-spin" /> Guardando...</>
                        : <><Save size={14} /> Guardar cambios</>}
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP: SUCCESS ── */}
              {step === 'success' && (
                <div className="flex flex-col items-center gap-5 py-4 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,139,139,0.12)', border: '1px solid rgba(0,139,139,0.3)' }}>
                    <CheckCircle2 size={32} style={{ color: '#008b8b' }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">¡Medición actualizada!</h3>
                    <p className="text-sm text-white/50 mt-1">
                      El plan <span className="text-white font-semibold">#{plan?.id}</span> fue actualizado correctamente.
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
                    style={{
                      background: 'linear-gradient(135deg, #2e5871 0%, #008b8b 100%)',
                      boxShadow: '0 4px 20px rgba(0,139,139,0.25)',
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}