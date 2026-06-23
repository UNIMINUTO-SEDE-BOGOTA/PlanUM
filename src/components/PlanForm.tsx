import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Send, Sparkles, Loader2, CheckCircle2, ChevronDown, ArrowLeft, Check, Link2, ExternalLink, AlertCircle, RefreshCw, Plus, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { PlanData } from '../App';

interface PlanFormProps {
  onSubmit: (data: PlanData) => void;
  initialData?: PlanData | null;
  onGoHome?: () => void;
  saving?: boolean;
}

const EMPTY_FORM: PlanData = {
  tipoPlan: '',
  año: '',
  frentePDI: '', nivel1: '', nivel2: '', prioridad: '',
  vicerrectoria: '', areaPrograma: '', cargoResponsable: '', iniciativa: '',
  indicador: '', lineaBase: '', medicion: '',
  accionMejora: '', meta: '', actividad: '',
  fechaInicio: '', fechaCierre: '',
  avance: '', evidencia: '', evidenciaUrl: '', evidenciaUrls: [],
};

const TIPOS_PLAN = [
  'Institucional',
  'Programas',
  'Sistema de Gestión de Calidad',
  'Riesgos',
  'Plan Estratégico',
  'N/A',
];

const AÑO_ACTUAL = new Date().getFullYear();
const AÑOS = Array.from({ length: 8 }, (_, i) => String(AÑO_ACTUAL - 4 + i));

const FRENTE_PDI = [
  '1. Identidad misional y cultura Minuto de Dios',
  '2. Innovacion academica, calidad y experiencia vibrante',
  '3. Investigacion, innovacion e impacto social',
  '4. Centros universitarios y desarrollo organizacional',
  '5. UNIMINUTO Virtual',
  '6. Sistema Universitario Digital',
  '7. Mercadeo, captacion y experiencia',
  '8. Sostenibilidad y ecologia integral',
];

const NIVEL1 = [
  'Institucional 1: Identidad institucional',
  'Institucional 2: Gobierno institucional y transparencia',
  'Institucional 3: Desarrollo, gestión y sostenibilidad institucional',
  'Institucional 4: Mejoramiento continuo y autorregulacion',
  'Institucional 5: Estructura y procesos academicos',
  'Institucional 6: Aportes de la investigacion, la innovacion y el desarrollo tecnologico',
  'Institucional 7: Impacto social',
  'Institucional 8: Visibilidad nacional e internacional',
  'Institucional 9: Bienestar institucional',
  'Institucional 10: Comunidad de profesores',
  'Institucional 11: Comunidad de estudiantes',
  'Institucional 12: Comunidad de egresados',
  'Programa 1: Proyecto educativo del programa',
  'Programa 2: Estudiantes',
  'Programa 3: Profesores',
  'Programa 4: Egresados',
  'Programa 5: Aspectos academicos y resultados de aprendizaje',
  'Programa 6: Permanencia y graduacion',
  'Programa 7: Interaccion con el entorno nacional e internacional',
  'Programa 8: Aportes de la investigacion, la innovacion, el desarrollo tecnologico',
  'Programa 9: Bienestar de la comunidad academica del programa',
  'Programa 10: Medios educativos y ambientes de aprendizaje',
  'Programa 11: Organizacion, administracion y financiacion del programa',
  'Programa 12: Recursos fisicos y tecnologicos',
  'Macroproceso 1: Direccionamiento estrategico',
  'Macroproceso 2: Calidad integral',
  'Macroproceso 3: Relaciones interinstitucionales',
  'Macroproceso 4: Desarrollo integral del talento humano',
  'Macroproceso 5: Bienestar institucional e identidad misional',
  'Macroproceso 6: Docencia',
  'Macroproceso 7: Investigacion',
  'Macroproceso 8: Proyeccion social',
  'Macroproceso 9: Gestion administrativa y financiera',
  'Macroproceso 10: Gestion de mercadeo y posicionamiento',
  'Macroproceso 11: Gestion Juridica',
  'Macroproceso 12: Gestion de la planeacion y control',
  'Macroproceso 13: Gestion de la infraestructura fisica y tecnologica',
];

const NIVEL2 = [
  'Institucional 1: Identidad institucional',
  'Institucional 2: Gobierno institucional y transparencia',
  'Institucional 3: Desarrollo, gestión y sostenibilidad institucional',
  'Institucional 4: Mejoramiento continuo y autorregulacion',
  'Institucional 5: Estructura y procesos academicos',
  'Institucional 6: Aportes de la investigacion, la innovacion y el desarrollo tecnologico',
  'Institucional 7: Impacto social',
  'Institucional 8: Visibilidad nacional e internacional',
  'Institucional 9: Bienestar institucional',
  'Institucional 10: Comunidad de profesores',
  'Institucional 11: Comunidad de estudiantes',
  'Institucional 12: Comunidad de egresados',
  'Programa 1: Proyecto educativo del programa',
  'Programa 2: Estudiantes',
  'Programa 3: Profesores',
  'Programa 4: Egresados',
  'Programa 5: Aspectos academicos y resultados de aprendizaje',
  'Programa 6: Permanencia y graduacion',
  'Programa 7: Interaccion con el entorno nacional e internacional',
  'Programa 8: Aportes de la investigacion, la innovacion, el desarrollo tecnologico',
  'Programa 9: Bienestar de la comunidad academica del programa',
  'Programa 10: Medios educativos y ambientes de aprendizaje',
  'Programa 11: Organizacion, administracion y financiacion del programa',
  'Programa 12: Recursos fisicos y tecnologicos',
  'Proceso 1: Planeacion estrategica',
  'Proceso 2: Gestion de la informacion',
  'Proceso 3: Gestion de proyectos',
  'Proceso 4: Aseguramiento de la calidad de procesos',
  'Proceso 5: Aseguramiento de la calidad academica',
  'Proceso 6: Gestion del registro calificado',
  'Proceso 7: Gestion de la experiencia del usuario',
  'Proceso 8: Asuntos globales',
  'Proceso 9: Alianzas e iniciativas estrategicas',
  'Proceso 10: Comunicaciones corporativas',
  'Proceso 11: Atraccion, seleccion y onboarding',
  'Proceso 12: Gestion del conocimiento corporativo',
  'Proceso 13: Contratacion y nomina',
  'Proceso 14: Desarrollo y sucesion',
  'Proceso 15: Seguridad, salud en el trabajo y gestion ambiental',
  'Proceso 16: Cultura del desempeño',
  'Proceso 17: Diseño organizacional y compensacion',
  'Proceso 18: Desarrollo y fortalecimiento del bienestar institucional',
  'Proceso 19: Pastoral',
  'Proceso 20: Enseñanza, aprendizaje y evaluacion',
  'Proceso 21: Desarrollo curricular',
  'Proceso 22: Vida estudiantil',
  'Proceso 23: Investigacion, desarrollo, innovacion y creacion artistica y cultural',
  'Proceso 24: Investigacion formativa',
  'Proceso 25: Gestion editorial',
  'Proceso 26: Transferencia de conocimiento y tecnologia',
  'Proceso 27: Practica profesional',
  'Proceso 28: Practica en responsabilidad social',
  'Proceso 29: Voluntariado',
  'Proceso 30: Relacionamiento con egresados y egresados no graduados',
  'Proceso 31: Educacion continua',
  'Proceso 32: Articulacion',
  'Proceso 33: Gestion y desarrollo del emprendimiento',
  'Proceso 34: Gestion de la empleabilidad',
  'Proceso 35: Gestion de ingresos',
  'Proceso 36: Aprovisionamiento',
  'Proceso 37: Planeacion financiera y presupuesto',
  'Proceso 38: Administracion de tesoreria',
  'Proceso 39: Gestion academico-Administrativa',
  'Proceso 40: Cotabilidad financiera y costeo',
  'Proceso 41: Gestion documental',
  'Proceso 42: Investigacion de mercados',
  'Proceso 43: Comercializacion y ventas',
  'Proceso 44: Asuntos judiciales y administrativos',
  'Proceso 45: Asesoria y apoyo juridico',
  'Proceso 46: Gestion de riesgos y oportunidades',
  'Proceso 47: Auditoria de control interno',
  'Proceso 48: Construccion, adecuacion y mantenimiento de la infraestructura fisica',
  'Proceso 49: Gestion del servicio de tecnologia',
  'Proceso 50: Gestion de soluciones TI',
];

const VICERRECTORIAS = [
  'Rectoria',
  'Vicerrectoria Academica',
  'Vicerrectoria Proyeccion social',
  'Vicerrectoria Operaciones',
  'Escuela: Desarrollo Humano y Transformación Social',
  'Escuela: Futuros de la educacion',
  'Escuela: Negocios, Emprendimiento y Competitividad Territorial',
  'Escuela: Creación, Comunicación y Cultura',
  'Escuela: Ingeniería, Tecnología y Sostenibilidad',
  'Escuela: Salud y Cuidado Integral',
];

const PRIORIDADES = [
  'Alta — Riesgo Crítico',
  'Media — Riesgo Moderado',
  'Baja — Riesgo Bajo',
];

type AIStatus = 'idle' | 'loading' | 'done';

interface UrlItem {
  id: string;
  value: string;
  status: 'idle' | 'loading' | 'valid' | 'invalid';
  message: string;
}

const STEPS = [
  { id: 'pdi',        label: 'Identificación PDI',  emoji: '🎯' },
  { id: 'unidad',     label: 'Unidad Responsable',   emoji: '🏛️' },
  { id: 'indicadores',label: 'Indicadores',          emoji: '📊' },
  { id: 'accion',     label: 'Acción de mejora',     emoji: '✦ IA' },
  { id: 'meta',       label: 'Meta',                 emoji: '📌' },
  { id: 'actividad',  label: 'Actividad',            emoji: '✦ IA' },
  { id: 'cronograma', label: 'Cronograma',           emoji: '📅' },
  { id: 'avance',     label: 'Avance',               emoji: '📈' },
  { id: 'evidencia',  label: 'Evidencia',            emoji: '📎' },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function PlanForm({ onSubmit, initialData, onGoHome }: PlanFormProps) {
  const [step, setStep]         = useState(0);
  const [direction, setDir]     = useState(1);
  const [formData, setFormData] = useState<PlanData>(initialData ?? EMPTY_FORM);
  
  // ─── Estado para el tema ───
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (document.documentElement.getAttribute('data-theme') as 'dark' | 'light') || 'dark'
  );

  const [aiStatus, setAiStatus]     = useState<Record<string, AIStatus>>({});
  const [aiSuggestions, setAiSugg]  = useState<Record<string, string>>({});
  const [aiVerified, setAiVerified] = useState<Record<string, boolean>>({});

  const [urls, setUrls] = useState<UrlItem[]>(() => {
    const initialUrls = initialData?.evidenciaUrls || [];
    if (initialUrls.length > 0) {
      return initialUrls.map((url, idx) => ({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${idx}`,
        value: url,
        status: 'idle' as const,
        message: '',
      }));
    }
    if (initialData?.evidenciaUrl) {
      return [{
        id: crypto.randomUUID ? crypto.randomUUID() : '1',
        value: initialData.evidenciaUrl,
        status: 'idle' as const,
        message: '',
      }];
    }
    return [{ id: crypto.randomUUID ? crypto.randomUUID() : '1', value: '', status: 'idle', message: '' }];
  });

  // ─── Escuchar cambios de tema ───
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') as 'dark' | 'light';
      if (newTheme && newTheme !== theme) {
        setTheme(newTheme);
      }
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    
    return () => observer.disconnect();
  }, [theme]);

  const totalSteps = STEPS.length;
  const progress   = ((step) / (totalSteps - 1)) * 100;

  const go = (next: number) => {
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  const setFormField = (field: keyof PlanData, value: string) => {
    setFormData(p => ({ ...p, [field]: value }));
  };

  const addUrlField = () => {
    setUrls(prev => [...prev, {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${prev.length}`,
      value: '',
      status: 'idle',
      message: '',
    }]);
  };

  const removeUrlField = (id: string) => {
    setUrls(prev => prev.filter(url => url.id !== id));
  };

  const updateUrlValue = (id: string, value: string) => {
    setUrls(prev => prev.map(url =>
      url.id === id ? { ...url, value, status: 'idle', message: '' } : url
    ));
  };

  const verifySingleUrl = async (id: string) => {
    const urlItem = urls.find(u => u.id === id);
    if (!urlItem || !urlItem.value.trim()) return;

    setUrls(prev => prev.map(u =>
      u.id === id ? { ...u, status: 'loading', message: '' } : u
    ));

    const onedrivePattern = /^(https?:\/\/)?(.*\.)?(onedrive\.live\.com|1drv\.ms|sharepoint\.com)\/.*/i;
    await new Promise(resolve => setTimeout(resolve, 500));

    if (onedrivePattern.test(urlItem.value)) {
      setUrls(prev => prev.map(u =>
        u.id === id ? { ...u, status: 'valid', message: '✓ Enlace de OneDrive válido' } : u
      ));
    } else {
      setUrls(prev => prev.map(u =>
        u.id === id ? { ...u, status: 'invalid', message: '✗ El enlace no parece ser de OneDrive. Asegúrate de copiar el enlace correcto.' } : u
      ));
    }
  };

  const openUrl = (url: string) => {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else if (url) {
      window.open('https://' + url, '_blank');
    }
  };

  const verifyWithAI = async (field: keyof PlanData) => {
    const val = formData[field] as string;
    if (!val || !val.trim()) {
      setAiStatus(p => ({ ...p, [field]: 'done' }));
      setAiVerified(p => ({ ...p, [field]: true }));
      setAiSugg(p => ({ ...p, [field]: 'No hay texto para verificar. El campo se ha marcado como válido.' }));
      return;
    }

    setAiStatus(p => ({ ...p, [field]: 'loading' }));

    try {
      const tipo = field === 'meta' ? 'META' : 'ACCION';

      const res = await fetch(import.meta.env.VITE_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          operation: 'webhook_orientador',
          table: '',
          data: {
            mensaje: val,
            tipo,
            contexto: {
              tipoPlan:      formData.tipoPlan,
              frentePDI:     formData.frentePDI,
              nivel1:        formData.nivel1,
              nivel2:        formData.nivel2,
              vicerrectoria: formData.vicerrectoria,
            },
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setAiSugg(p => ({ ...p, [field]: data.data?.orientacion ?? 'Sin sugerencia disponible.' }));
      setAiStatus(p => ({ ...p, [field]: 'done' }));
      setAiVerified(p => ({ ...p, [field]: true }));

    } catch (err) {
      console.error('Error webhook:', err);
      setAiSugg(p => ({ ...p, [field]: 'No se pudo conectar con el orientador. Intenta de nuevo.' }));
      setAiStatus(p => ({ ...p, [field]: 'done' }));
      setAiVerified(p => ({ ...p, [field]: true }));
    }
  };

  const acceptSuggestion = (field: keyof PlanData) => {
    const s = aiSuggestions[field];
    if (!s) return;
    const clean = s.replace(/^.*?:\s*"?/, '').replace(/"?\s*$/, '').trim();
    setFormData(p => ({ ...p, [field]: clean }));
    setAiStatus(p => ({ ...p, [field]: 'idle' }));
    setAiSugg(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const dismissSuggestion = (field: keyof PlanData) => {
    setAiStatus(p => ({ ...p, [field]: 'idle' }));
    setAiSugg(p => { const n = { ...p }; delete n[field]; return n; });
  };

  const isAiVerified = (field: keyof PlanData): boolean => aiVerified[field] === true;

  const canAdvance = (): boolean => {
    const s = STEPS[step].id;
    if (s === 'pdi')        return !!(formData.tipoPlan && formData.año && formData.frentePDI && formData.nivel1 && formData.nivel2 && formData.prioridad);
    if (s === 'unidad')     return !!(formData.vicerrectoria && formData.areaPrograma && formData.cargoResponsable && formData.iniciativa);
    if (s === 'indicadores')return !!(formData.indicador && formData.lineaBase && formData.medicion);
    if (s === 'accion')     return !!(isAiVerified('accionMejora'));
    if (s === 'meta')       return !!(isAiVerified('meta'));
    if (s === 'actividad')  return !!(isAiVerified('actividad'));
    if (s === 'cronograma') return !!(formData.fechaInicio && formData.fechaCierre);
    if (s === 'avance')     return !!formData.avance?.trim();
    if (s === 'evidencia')  return true;
    return true;
  };

  const handleSubmit = () => {
    const evidenciaUrls = urls.map(u => u.value).filter(v => v.trim());
    onSubmit({ ...formData, evidenciaUrls });
  };

  // ── Estilos dinámicos según tema (usando el estado) ──
  const isLight = theme === 'light';
  
  const inputCls = `w-full rounded-xl px-4 py-3.5 text-sm transition-all
    focus:outline-none focus:border-[#008b8b]/60 focus:ring-1 focus:ring-[#008b8b]/30
    ${isLight
      ? 'warm-input text-[#1a100a] placeholder:text-[rgba(26,16,10,0.35)]'
      : 'bg-white/5 border border-white/10 text-white placeholder:text-white/30'
    }`;

  const renderAIField = (field: keyof PlanData, emoji: string, title: string, desc: string, placeholder: string) => {
    const status     = aiStatus[field] || 'idle';
    const suggestion = aiSuggestions[field];
    const verified   = isAiVerified(field);
    const fieldValue = formData[field] as string;

    return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji={emoji} title={title} desc={desc} ai mandatory theme={theme} />
        <div className="flex flex-col gap-2">
          <textarea
            rows={4}
            value={fieldValue}
            onChange={e => setFormField(field, e.target.value)}
            placeholder={placeholder}
            className={`${inputCls} resize-none ${verified ? 'border-emerald-500/40' : ''}`}
          />
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            {!verified && (
              <button
                type="button"
                onClick={() => verifyWithAI(field)}
                disabled={status === 'loading'}
                className={`flex items-center gap-2 text-xs px-4 py-2 rounded-lg font-medium transition-all
                  ${status === 'loading' ? 'opacity-60 cursor-wait' : ''}
                  bg-[#008b8b]/10 text-[#008b8b] border border-[#008b8b]/30 hover:bg-[#008b8b]/20 disabled:opacity-30 disabled:cursor-not-allowed`}>
                {status === 'loading'
                  ? <><Loader2 size={13} className="animate-spin" /> Verificando...</>
                  : <><Sparkles size={13} /> Verificar con IA</>}
              </button>
            )}
            {verified && (
              <span className="flex items-center gap-2 text-xs px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 size={13} /> Verificado con IA
              </span>
            )}
            {verified && status !== 'loading' && (
              <button
                type="button"
                onClick={() => verifyWithAI(field)}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all"
                style={{
                  background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                  color: 'var(--text-muted)',
                }}
              >
                <RefreshCw size={12} /> Nueva consulta
              </button>
            )}
            {!verified && status !== 'loading' && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <AlertCircle size={12} /> Obligatorio presionar 'Verificar con IA'
              </span>
            )}
          </div>
        </div>
        <AIPanel field={field} status={status} suggestion={suggestion}
          onAccept={acceptSuggestion} onDismiss={dismissSuggestion} />
      </div>
    );
  };

  const renderStep = () => {
    const s = STEPS[step].id;

    if (s === 'pdi') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="🎯" title="Identificación PDI"
          desc="Ubica tu plan dentro del marco del Plan de Desarrollo Institucional." theme={theme} />
        <SelectField
          label="Tipo de plan"
          value={formData.tipoPlan}
          options={TIPOS_PLAN}
          onChange={v => setFormField('tipoPlan', v)}
          theme={theme}
        />
        <SelectField
          label="Año"
          value={formData.año}
          options={AÑOS}
          onChange={v => setFormField('año', v)}
          theme={theme}
        />
        <SelectField label="Frente PDI relacionado" value={formData.frentePDI} options={FRENTE_PDI}
          onChange={v => setFormField('frentePDI', v)} theme={theme} />
        <SelectField label="Factor Primario - Macroproceso" value={formData.nivel1} options={NIVEL1}
          onChange={v => setFormField('nivel1', v)} theme={theme} />
        <SelectField label="Factor Secundario - Proceso y Riesgo" value={formData.nivel2} options={NIVEL2}
          onChange={v => setFormField('nivel2', v)} theme={theme} />
        <SelectField label="Prioridad / Nivel de riesgo" value={formData.prioridad} options={PRIORIDADES}
          onChange={v => setFormField('prioridad', v)} theme={theme} />
      </div>
    );

    if (s === 'unidad') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="🏛️" title="Unidad Responsable"
          desc="Define quién lidera y ejecuta este plan de mejora." theme={theme} />
        <SelectField label="Vicerrectoría / Escuelas" value={formData.vicerrectoria} options={VICERRECTORIAS}
          onChange={v => setFormField('vicerrectoria', v)} theme={theme} />
        <TextField 
          label="Área / Programa" 
          value={formData.areaPrograma}
          placeholder="Ej. Ingeniería de Sistemas" 
          onChange={v => setFormField('areaPrograma', v)} 
          cls={inputCls} 
        />
        <TextField 
          label="Cargo Responsable" 
          value={formData.cargoResponsable}
          placeholder="Ej. Director de Programa" 
          onChange={v => setFormField('cargoResponsable', v)} 
          cls={inputCls} 
        />
        <TextField 
          label="Iniciativa relacionada" 
          value={formData.iniciativa}
          placeholder="Ej. Plan de retención 2025" 
          onChange={v => setFormField('iniciativa', v)} 
          cls={inputCls} 
        />
      </div>
    );

    if (s === 'indicadores') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="📊" title="Indicadores"
          desc="Define cómo se medirá el avance y el resultado del plan." theme={theme} />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Indicador</span>
          <textarea
            rows={3}
            value={formData.indicador}
            onChange={e => setFormField('indicador', e.target.value)}
            placeholder="Ej. Porcentaje de estudiantes que aprueban el primer semestre"
            className={`${inputCls} resize-none`}
          />
        </label>
        <TextField 
          label="Línea base" 
          value={formData.lineaBase}
          placeholder="Ej. 62% (dato del periodo anterior)" 
          onChange={v => setFormField('lineaBase', v)} 
          cls={inputCls} 
        />
        <TextField 
          label="Medición" 
          value={formData.medicion}
          placeholder="Ej. Semestral / Anual / Trimestral" 
          onChange={v => setFormField('medicion', v)} 
          cls={inputCls} 
        />
      </div>
    );

    if (s === 'accion') return renderAIField(
      'accionMejora', '⚡', 'Acción de mejora',
      'Describe la acción concreta que se implementará. La IA buscará acciones similares en el PUM y te orientará.',
      'Describe la acción de mejora...'
    );

    if (s === 'meta') return renderAIField(
      'meta', '📌', 'Meta',
      'Define el resultado esperado de forma medible. La IA buscará metas similares en el PUM para orientarte.',
      'Define la meta cuantificable...'
    );

    if (s === 'actividad') return renderAIField(
      'actividad', '📋', 'Actividad',
      'Detalla las actividades específicas. La IA te ayudará a estructurarlas por hitos.',
      'Detalla las actividades...'
    );

    if (s === 'cronograma') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="📅" title="Cronograma"
          desc="Define el período de ejecución del plan de mejora." theme={theme} />
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Fecha de inicio</span>
            <input 
              type="date" 
              value={formData.fechaInicio}
              onChange={e => setFormField('fechaInicio', e.target.value)}
              className={`${inputCls} [color-scheme:dark]`} 
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Fecha de cierre</span>
            <input 
              type="date" 
              value={formData.fechaCierre}
              onChange={e => setFormField('fechaCierre', e.target.value)}
              className={`${inputCls} [color-scheme:dark]`} 
            />
          </label>
        </div>
      </div>
    );

    if (s === 'avance') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="📈" title="Avance"
          desc="Reporta el estado actual del plan incluyendo porcentaje de cumplimiento y obstáculos encontrados." theme={theme} />
        <label className="flex flex-col gap-1.5">
          <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Avance</span>
          <textarea 
            rows={4} 
            value={formData.avance}
            onChange={e => setFormField('avance', e.target.value)}
            placeholder="Describe el avance actual..."
            className={`${inputCls} resize-none`} 
          />
        </label>
      </div>
    );

    if (s === 'evidencia') return (
      <div className="flex flex-col gap-5">
        <StepIntro emoji="📎" title="Evidencia"
          desc="Indica qué documentos o registros respaldan el avance reportado." theme={theme} />

        <label className="flex flex-col gap-1.5">
          <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Descripción de evidencia</span>
          <textarea 
            rows={3} 
            value={formData.evidencia}
            onChange={e => setFormField('evidencia', e.target.value)}
            placeholder="Describe los documentos o registros que respaldan el avance..."
            className={`${inputCls} resize-none`} 
          />
        </label>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>Enlaces OneDrive</span>
            <button type="button" onClick={addUrlField}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-[#008b8b]/10 text-[#008b8b] border border-[#008b8b]/30 hover:bg-[#008b8b]/20 transition-all">
              <Plus size={12} /> Agregar enlace
            </button>
          </div>

          {urls.map((urlItem) => (
            <div key={urlItem.id} className="flex flex-col gap-2 p-3 rounded-xl" style={{
              background: isLight ? '#f1f0ec' : 'rgba(255,255,255,0.05)',
              border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.1)',
            }}>
              <div className="flex gap-2">
                <input 
                  type="url" 
                  value={urlItem.value}
                  onChange={e => updateUrlValue(urlItem.id, e.target.value)}
                  placeholder="https://uniminuto-my.sharepoint.com/..."
                  className={`flex-1 rounded-xl px-4 py-3 text-sm transition-all
                    focus:outline-none focus:border-[#008b8b]/60 focus:ring-1 focus:ring-[#008b8b]/30
                    ${isLight
                      ? 'warm-input text-[#1a100a] placeholder:text-[rgba(26,16,10,0.35)]'
                      : 'bg-white/5 border border-white/10 text-white placeholder:text-white/30'
                    }
                    ${urlItem.status === 'valid' ? 'border-emerald-500/60' : urlItem.status === 'invalid' ? 'border-red-500/60' : ''}`}
                />
                <button 
                  type="button" 
                  onClick={() => verifySingleUrl(urlItem.id)}
                  disabled={urlItem.status === 'loading' || !urlItem.value.trim()}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-all bg-[#008b8b]/10 text-[#008b8b] border border-[#008b8b]/30 hover:bg-[#008b8b]/20 disabled:opacity-50"
                >
                  {urlItem.status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Link2 size={16} />}
                </button>
                {urlItem.value && urlItem.status === 'valid' && (
                  <button 
                    type="button" 
                    onClick={() => openUrl(urlItem.value)}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: isLight ? '#f1f0ec' : 'rgba(255,255,255,0.05)',
                      color: 'var(--text-muted)',
                      border: isLight ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <ExternalLink size={16} />
                  </button>
                )}
                {urls.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeUrlField(urlItem.id)}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {urlItem.message && (
                <p className={`text-xs mt-1 ${urlItem.status === 'valid' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {urlItem.message}
                </p>
              )}
            </div>
          ))}

          <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <AlertCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-300/80">
                📌 <strong>Importante:</strong> Al compartir el enlace, asegúrate de seleccionar la opción
                <strong className="text-amber-200"> "Cualquier persona que tenga el enlace puede ver"</strong>.
                De lo contrario, no podremos acceder a la evidencia.
              </p>
            </div>
          </div>
        </div>
      </div>
    );

    return null;
  };

  return (
    <div className="relative flex flex-col min-h-screen py-10 px-4">
      {onGoHome && (
        <button 
          onClick={onGoHome}
          className="group flex items-center gap-1.5 text-sm mb-8 self-start transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Página principal
        </button>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Paso {step + 1} de {totalSteps}
          </span>
          <span className="text-xs font-semibold" style={{ color: '#008b8b' }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-color)' }}>
          <motion.div 
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #2e5871, #008b8b)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }} 
          />
        </div>
        <div className="flex gap-1.5 mt-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex-1 h-0.5 rounded-full transition-all duration-300"
              style={{ background: i <= step ? '#008b8b' : 'var(--border-color)' }} />
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl flex-1 warm-card"
        style={{ border: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
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

      <div className="flex items-center justify-between mt-6">
        <button 
          onClick={() => go(step - 1)} 
          disabled={step === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all
            disabled:opacity-0 disabled:pointer-events-none"
          style={{
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
          }}
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
                : 'var(--bg-card)',
              boxShadow: canAdvance() ? '0 4px 20px rgba(0,139,139,0.25)' : 'none',
            }}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            className="flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all
              hover:scale-[1.02] active:scale-[0.98]"
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

function AIPanel({ field, status, suggestion, onAccept, onDismiss }: {
  field: keyof PlanData;
  status: AIStatus;
  suggestion?: string;
  onAccept: (f: keyof PlanData) => void;
  onDismiss: (f: keyof PlanData) => void;
}) {
  return (
    <AnimatePresence>
      {status === 'done' && suggestion && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          className="overflow-hidden"
        >
          <div className="p-4 rounded-xl border border-[#008b8b]/25 bg-[#008b8b]/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={13} style={{ color: '#008b8b' }} />
              <span className="text-xs font-semibold" style={{ color: '#008b8b' }}>Orientación IA</span>
            </div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text-secondary)' }}>{suggestion}</p>
            <div className="flex gap-2">
              <button 
                onClick={() => onAccept(field)}
                className="flex-1 text-xs py-2 rounded-lg font-medium transition-all"
                style={{ background: 'rgba(0,139,139,0.15)', color: '#008b8b', border: '1px solid rgba(0,139,139,0.3)' }}
              >
                Aceptar sugerencia
              </button>
              <button 
                onClick={() => onDismiss(field)}
                className="text-xs px-4 py-2 rounded-lg transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-muted)',
                }}
              >
                Ignorar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepIntro({ emoji, title, desc, ai, mandatory, theme }: {
  emoji: string; 
  title: string; 
  desc: string; 
  ai?: boolean; 
  mandatory?: boolean;
  theme?: 'dark' | 'light';
}) {
  return (
    <div className="mb-2">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{emoji}</span>
        <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        {ai && (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(0,139,139,0.12)', color: '#008b8b', border: '1px solid rgba(0,139,139,0.25)' }}
          >
            <Sparkles size={9} /> IA
          </span>
        )}
        {mandatory && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            Obligatorio
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
    </div>
  );
}

function SelectField({ label, value, options, onChange, theme }: {
  label: string; 
  value: string; 
  options: string[]; 
  onChange: (v: string) => void;
  theme?: 'dark' | 'light';
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; openUp: boolean } | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open || !btnRef.current) return;
    const handler = () => {
      if (!btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = Math.min(options.length * 44 + 8, 224);
      const openUp = spaceBelow < menuHeight + 8 && rect.top > menuHeight;
      setCoords({ top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6, left: rect.left, width: rect.width, openUp });
    };
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [open, options.length]);

  const handleOpen = () => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuHeight = Math.min(options.length * 44 + 8, 224);
    const openUp = spaceBelow < menuHeight + 8 && rect.top > menuHeight;
    setCoords({ top: openUp ? rect.top - menuHeight - 6 : rect.bottom + 6, left: rect.left, width: rect.width, openUp });
    setOpen(o => !o);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <button 
        ref={btnRef} 
        type="button" 
        onClick={handleOpen}
        className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm
          transition-all hover:border-white/20 focus:outline-none
          ${open ? 'border-[#008b8b]/60 ring-1 ring-[#008b8b]/30' : ''}
          ${isLight
            ? 'warm-select'
            : 'bg-white/5 border border-white/10 text-white'
          }
          ${value ? '' : isLight ? 'text-[rgba(26,16,10,0.4)]' : 'text-white/30'}`}
      >
        <span className="truncate">{value || 'Seleccionar...'}</span>
        <ChevronDown 
          size={14} 
          className="ml-2 shrink-0 transition-transform duration-200"
          style={{ 
            color: 'var(--text-muted)', 
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)' 
          }} 
        />
      </button>

      <AnimatePresence>
        {open && coords && (
          <motion.div 
            ref={menuRef}
            initial={{ opacity: 0, y: coords.openUp ? 6 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: coords.openUp ? 6 : -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'fixed', 
              top: coords.top, 
              left: coords.left, 
              width: coords.width, 
              zIndex: 9999,
              background: isLight ? '#ffffff' : 'rgba(11, 22, 31, 0.98)',
              border: isLight ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,139,139,0.3)',
              borderRadius: '0.75rem',
              boxShadow: isLight
                ? '0 12px 40px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)'
                : '0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,139,139,0.1)',
              backdropFilter: 'blur(16px)',
              overflow: 'hidden',
            }}
          >
            <div style={{ maxHeight: '224px', overflowY: 'auto', padding: '4px 0' }}>
              {options.map(o => (
                <button 
                  key={o} 
                  type="button" 
                  onClick={() => { onChange(o); setOpen(false); }}
                  style={{
                    width: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '10px 16px', 
                    fontSize: '0.875rem', 
                    textAlign: 'left', 
                    transition: 'background 0.15s',
                    background: value === o ? 'rgba(0,139,139,0.15)' : 'transparent',
                    color: value === o 
                      ? (isLight ? '#1a100a' : '#ffffff') 
                      : (isLight ? 'rgba(26,16,10,0.6)' : 'rgba(255,255,255,0.55)'),
                    border: 'none', 
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    if (value !== o) {
                      (e.currentTarget as HTMLElement).style.background = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.color = isLight ? '#1a100a' : '#fff';
                    }
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = value === o ? 'rgba(0,139,139,0.15)' : 'transparent';
                    (e.currentTarget as HTMLElement).style.color = value === o 
                      ? (isLight ? '#1a100a' : '#fff') 
                      : (isLight ? 'rgba(26,16,10,0.6)' : 'rgba(255,255,255,0.55)');
                  }}
                >
                  <span>{o}</span>
                  {value === o && <Check size={13} style={{ color: '#008b8b', flexShrink: 0, marginLeft: '8px' }} />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TextField({ label, value, placeholder, onChange, cls }: {
  label: string; 
  value: string; 
  placeholder?: string; 
  onChange: (v: string) => void; 
  cls: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>{label}</span>
      <input 
        type="text" 
        value={value} 
        placeholder={placeholder}
        onChange={e => onChange(e.target.value)} 
        className={cls} 
      />
    </label>
  );
}