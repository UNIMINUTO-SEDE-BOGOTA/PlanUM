import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Sparkles, Loader2, CheckCircle2, ChevronDown, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { PlanData } from '../App';

interface PlanFormProps {
  onSubmit: (data: PlanData) => void;
  initialData?: PlanData | null;
  onGoHome?: () => void;
}

const EMPTY_FORM: PlanData = {
  frentePDI: '', nivel1: '', nivel2: '', prioridad: '',
  vicerrectoria: '', areaPrograma: '', cargoResponsable: '', iniciativa: '',
  accionMejora: '', meta: '', actividad: '',
  fechaInicio: '', fechaCierre: '',
  avance: '', evidencia: '',
};

const FRENTE_PDI = [
  'Docencia e innovación curricular',
  'Investigación y producción de conocimiento',
  'Internacionalización',
  'Extensión y proyección social',
  'Bienestar universitario',
  'Gestión institucional',
];
const NIVEL1 = [
  'Acreditación institucional',
  'Calidad académica',
  'Transformación digital',
  'Sostenibilidad financiera',
  'Talento humano',
];
const NIVEL2 = [
  'Diseño curricular',
  'Evaluación docente',
  'Infraestructura tecnológica',
  'Gestión del riesgo',
  'Cultura organizacional',
];
const VICERRECTORIAS = [
  'Vicerrectoría Académica',
  'Vicerrectoría Administrativa',
  'Vicerrectoría de Investigación',
  'Facultad de Ingeniería',
  'Facultad de Ciencias Sociales',
  'Facultad de Ciencias Económicas',
  'Facultad de Salud',
];
const PRIORIDADES = [
  'Alta — Riesgo Crítico',
  'Media — Riesgo Moderado',
  'Baja — Riesgo Bajo',
];

type AIStatus = 'idle' | 'loading' | 'done';

/* ─── Pasos del wizard ─── */
const STEPS = [
  { id: 'pdi',        label: 'Identificación PDI',  emoji: '🎯' },
  { id: 'unidad',     label: 'Unidad Responsable',   emoji: '🏛️' },
  { id: 'accion',     label: 'Acción de mejora',     emoji: '✦ IA' },
  { id: 'meta',       label: 'Meta',                 emoji: '✦ IA' },
  { id: 'actividad',  label: 'Actividad',             emoji: '✦ IA' },
  { id: 'cronograma', label: 'Cronograma',            emoji: '📅' },
  { id: 'avance',     label: 'Avance',                emoji: '✦ IA' },
  { id: 'evidencia',  label: 'Evidencia',             emoji: '✦ IA' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function PlanForm({ onSubmit, initialData, onGoHome }: PlanFormProps) {
  const [step, setStep]       = useState(0);
  const [direction, setDir]   = useState(1);
  const [formData, setFormData] = useState<PlanData>(initialData ?? EMPTY_FORM);
  const [aiStatus, setAiStatus]         = useState<Record<string, AIStatus>>({});
  const [aiSuggestions, setAiSugg]      = useState<Record<string, string>>({});
  const [aiAccepted, setAiAccepted]     = useState<Record<string, boolean>>({});

  const totalSteps = STEPS.length;
  const progress   = ((step) / (totalSteps - 1)) * 100;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const set = (field: keyof PlanData, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
    if (aiAccepted[field]) setAiAccepted(p => ({ ...p, [field]: false }));
  };

  const verifyWithAI = async (field: keyof PlanData) => {
    const val = formData[field];
    if (!val.trim()) return;
    setAiStatus(p => ({ ...p, [field]: 'loading' }));
    await new Promise(r => setTimeout(r, 1800));
    const mock: Record<string, string> = {
      accionMejora: `Reformular como: "${val}" — alineada con "${formData.frentePDI || 'el frente PDI'}", con indicadores medibles y responsables definidos.`,
      meta:         `Cuantifica la meta: "Incrementar en un 20% ${val.toLowerCase()} al finalizar el período académico."`,
      actividad:    `Desagrega en hitos trimestrales con responsable asignado: "${val}" — hitos T1, T2, T3.`,
      avance:       `Incluye: porcentaje completado, obstáculos y próxima acción. Ej: "${val} — 45% completado."`,
      evidencia:    `Adjunta: actas firmadas, registros o informes PDF con firma digital. Campo: "${val}".`,
    };
    setAiSugg(p => ({ ...p, [field]: mock[field] ?? `Sugerencia: "${val}" es adecuado. Agrega más contexto institucional.` }));
    setAiStatus(p => ({ ...p, [field]: 'done' }));
  };

  const acceptSuggestion = (field: keyof PlanData) => {
    const s = aiSuggestions[field];
    if (!s) return;
    const clean = s.replace(/^.*?:\s*"?/, '').replace(/"?\s*$/, '').trim();
    setFormData(p => ({ ...p, [field]: clean }));
    setAiAccepted(p => ({ ...p, [field]: true }));
  };

  const dismissSuggestion = (field: keyof PlanData) => {
    setAiStatus(p => ({ ...p, [field]: 'idle' }));
    setAiSugg(p => { const n = { ...p }; delete n[field]; return n; });
  };

  /* ── Validación simple por paso ── */
  const canAdvance = (): boolean => {
    const s = STEPS[step].id;
    if (s === 'pdi')       return !!(formData.frentePDI && formData.nivel1 && formData.nivel2 && formData.prioridad);
    if (s === 'unidad')    return !!(formData.vicerrectoria && formData.areaPrograma && formData.cargoResponsable && formData.iniciativa);
    if (s === 'accion')    return !!formData.accionMejora.trim();
    if (s === 'meta')      return !!formData.meta.trim();
    if (s === 'actividad') return !!formData.actividad.trim();
    if (s === 'cronograma')return !!(formData.fechaInicio && formData.fechaCierre);
    if (s === 'avance')    return !!formData.avance.trim();
    if (s === 'evidencia') return !!formData.evidencia.trim();
    return true;
  };

  const handleSubmit = () => onSubmit(formData);

  /* ── Estilos compartidos ── */
  const inputCls = `w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm
    placeholder:text-white/30 focus:outline-none focus:border-[#008b8b]/60 focus:ring-1 focus:ring-[#008b8b]/30
    transition-all hover:border-white/20`;

  const selectCls = `${inputCls} appearance-none cursor-pointer`;

  /* ─── Renders por paso ─── */
  const renderStep = () => {
    const s = STEPS[step].id;

    /* ── Paso 1: PDI ── */
    if (s === 'pdi') return (
      <div className="flex flex-col gap-5">
        <StepIntro
          emoji="🎯"
          title="Identificación PDI"
          desc="Ubica tu plan dentro del marco del Plan de Desarrollo Institucional."
        />
        <SelectField label="Frente PDI relacionado" value={formData.frentePDI} options={FRENTE_PDI}
          onChange={v => set('frentePDI', v)} cls={selectCls} />
        <SelectField label="Nivel 1 de particularización" value={formData.nivel1} options={NIVEL1}
          onChange={v => set('nivel1', v)} cls={selectCls} />
        <SelectField label="Nivel 2 de particularización" value={formData.nivel2} options={NIVEL2}
          onChange={v => set('nivel2', v)} cls={selectCls} />
        <SelectField label="Prioridad / Nivel de riesgo" value={formData.prioridad} options={PRIORIDADES}
          onChange={v => set('prioridad', v)} cls={selectCls} />
      </div>
    );

    /* ── Paso 2: Unidad ── */
    if (s === 'unidad') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="🏛️" title="Unidad Responsable" desc="Define quién lidera y ejecuta este plan de mejora." />
        <SelectField label="Vicerrectoría / Facultad" value={formData.vicerrectoria} options={VICERRECTORIAS}
          onChange={v => set('vicerrectoria', v)} cls={selectCls} />
        <TextField label="Área / Programa" value={formData.areaPrograma} placeholder="Ej. Ingeniería de Sistemas"
          onChange={v => set('areaPrograma', v)} cls={inputCls} />
        <TextField label="Cargo Responsable" value={formData.cargoResponsable} placeholder="Ej. Director de Programa"
          onChange={v => set('cargoResponsable', v)} cls={inputCls} />
        <TextField label="Iniciativa relacionada" value={formData.iniciativa} placeholder="Ej. Plan de retención 2025"
          onChange={v => set('iniciativa', v)} cls={inputCls} />
      </div>
    );

    /* ── Pasos IA ── */
    const aiFields: Record<string, { field: keyof PlanData; emoji: string; title: string; desc: string; placeholder: string }> = {
      accion:    { field: 'accionMejora', emoji: '⚡', title: 'Acción de mejora', desc: 'Describe la acción concreta que se implementará. La IA te ayudará a formularla de manera institucional.', placeholder: 'Describe la acción de mejora...' },
      meta:      { field: 'meta',         emoji: '🎯', title: 'Meta',             desc: 'Define el resultado esperado de forma medible. La IA sugerirá cómo cuantificarla mejor.', placeholder: 'Define la meta cuantificable...' },
      actividad: { field: 'actividad',    emoji: '📋', title: 'Actividad',         desc: 'Detalla las actividades específicas. La IA te ayudará a estructurarlas por hitos.', placeholder: 'Detalla las actividades...' },
      avance:    { field: 'avance',       emoji: '📈', title: 'Avance',            desc: 'Reporta el estado actual. La IA sugerirá cómo estructurarlo con porcentaje y obstáculos.', placeholder: 'Describe el avance actual...' },
      evidencia: { field: 'evidencia',    emoji: '📎', title: 'Evidencia',         desc: 'Indica qué documentos respaldan el avance. La IA sugerirá el tipo de evidencia adecuado.', placeholder: 'Indica el tipo de evidencia...' },
    };

    const aiKey = s === 'accion' ? 'accion' : s;
    if (aiFields[aiKey]) {
      const { field, emoji, title, desc, placeholder } = aiFields[aiKey];
      const status     = aiStatus[field] || 'idle';
      const suggestion = aiSuggestions[field];
      const accepted   = aiAccepted[field];
      return (
        <div className="flex flex-col gap-5">
          <StepIntro emoji={emoji} title={title} desc={desc} ai />
          <div className="flex flex-col gap-2">
            <textarea
              rows={4}
              value={formData[field]}
              onChange={e => set(field, e.target.value)}
              placeholder={placeholder}
              className={`${inputCls} resize-none ${accepted ? 'border-emerald-500/40' : ''}`}
            />
            {/* Botón verificar */}
            <button
              type="button"
              onClick={() => verifyWithAI(field)}
              disabled={status === 'loading' || !formData[field].trim()}
              className={`self-start flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-medium transition-all mt-1
                ${status === 'loading' ? 'opacity-60 cursor-wait' : ''}
                ${accepted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  'bg-[#008b8b]/10 text-[#008b8b] border border-[#008b8b]/30 hover:bg-[#008b8b]/20 disabled:opacity-30 disabled:cursor-not-allowed'}`}
            >
              {status === 'loading' ? <><Loader2 size={13} className="animate-spin" /> Verificando...</> :
               accepted             ? <><CheckCircle2 size={13} /> Aceptado</> :
                                      <><Sparkles size={13} /> Verificar con IA</>}
            </button>
          </div>

          {/* Sugerencia IA */}
          <AnimatePresence>
            {status === 'done' && suggestion && !accepted && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-xl border border-[#008b8b]/25 bg-[#008b8b]/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={13} style={{ color: '#008b8b' }} />
                    <span className="text-xs font-semibold" style={{ color: '#008b8b' }}>Sugerencia de IA</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{suggestion}</p>
                  <div className="flex gap-2">
                    <button onClick={() => acceptSuggestion(field)}
                      className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
                      style={{ background: 'rgba(0,139,139,0.15)', color: '#008b8b', border: '1px solid rgba(0,139,139,0.3)' }}>
                      Aceptar sugerencia
                    </button>
                    <button onClick={() => dismissSuggestion(field)}
                      className="text-xs px-4 py-2 rounded-lg bg-white/5 text-slate-500 hover:text-slate-300 transition-all">
                      Ignorar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    /* ── Paso cronograma ── */
    if (s === 'cronograma') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="📅" title="Cronograma" desc="Define el período de ejecución del plan de mejora." />
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs tracking-widest uppercase text-white/40 font-medium">Fecha de inicio</span>
            <input type="date" value={formData.fechaInicio}
              onChange={e => set('fechaInicio', e.target.value)}
              className={`${inputCls} [color-scheme:dark]`} />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs tracking-widest uppercase text-white/40 font-medium">Fecha de cierre</span>
            <input type="date" value={formData.fechaCierre}
              onChange={e => set('fechaCierre', e.target.value)}
              className={`${inputCls} [color-scheme:dark]`} />
          </label>
        </div>
      </div>
    );

    return null;
  };

  /* ─── UI ─── */
  return (
    <div className="relative flex flex-col min-h-screen py-10 px-4">

      {/* Flecha volver */}
      {onGoHome && (
        <button onClick={onGoHome}
          className="group flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm mb-8 self-start">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Página principal
        </button>
      )}

      {/* Barra de progreso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40 font-medium tracking-widest uppercase">
            Paso {step + 1} de {totalSteps}
          </span>
          <span className="text-xs font-semibold" style={{ color: '#008b8b' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #2e5871, #008b8b)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
        {/* Indicadores de pasos */}
        <div className="flex gap-1.5 mt-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 h-0.5 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#008b8b' : 'rgba(255,255,255,0.1)' }} />
          ))}
        </div>
      </div>

      {/* Tarjeta del paso */}
      <div className="relative overflow-hidden rounded-2xl flex-1"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="p-6 md:p-10"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => go(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all
            border border-white/10 text-white/50 hover:text-white hover:border-white/20
            disabled:opacity-0 disabled:pointer-events-none"
        >
          <ChevronLeft size={16} /> Anterior
        </button>

        {step < totalSteps - 1 ? (
          <button
            onClick={() => go(step + 1)}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all
              disabled:opacity-30 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: canAdvance()
                ? 'linear-gradient(135deg, #2e5871 0%, #008b8b 100%)'
                : 'rgba(255,255,255,0.08)',
              boxShadow: canAdvance() ? '0 4px 20px rgba(0,139,139,0.25)' : 'none',
            }}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance()}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all
              hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, #e15e29 0%, #c94d1a 100%)',
              boxShadow: '0 4px 20px rgba(225,94,41,0.3)',
            }}
          >
            <Send size={15} /> Generar plan
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Sub-componentes ── */

function StepIntro({ emoji, title, desc, ai }: { emoji: string; title: string; desc: string; ai?: boolean }) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {ai && (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(0,139,139,0.12)', color: '#008b8b', border: '1px solid rgba(0,139,139,0.25)' }}>
            <Sparkles size={9} /> IA
          </span>
        )}
      </div>
      <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function SelectField({ label, value, options, onChange, cls }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; cls: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs tracking-widest uppercase text-white/40 font-medium">{label}</span>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className={cls}>
          <option value="">Seleccionar...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
      </div>
    </label>
  );
}

function TextField({ label, value, placeholder, onChange, cls }: {
  label: string; value: string; placeholder?: string; onChange: (v: string) => void; cls: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs tracking-widest uppercase text-white/40 font-medium">{label}</span>
      <input type="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={cls} />
    </label>
  );
}