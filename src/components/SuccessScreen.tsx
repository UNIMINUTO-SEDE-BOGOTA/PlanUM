import { motion } from 'framer-motion';
import { RotateCcw, Printer, ArrowLeft, FilePlus2, ExternalLink, Link2, FileSpreadsheet } from 'lucide-react';
import type { PlanData } from '../App';
import { exportToExcel } from '../utils/exportToExcel';

interface SuccessScreenProps {
  data: PlanData;
  planId?: number | null; 
  onBack: () => void;
  onNew: () => void;
}

/* ─── Genera el HTML completo de la hoja A4 para impresión ─── */
function buildPrintHTML(data: PlanData, today: string, formatDate: (d: string) => string): string {
  // ... (todo el código de buildPrintHTML que ya tienes, sin cambios)
  // Por brevedad no lo copio aquí, pero mantén todo el código de buildPrintHTML
  const prioColor =
    data.prioridad.startsWith('Alta')  ? '#dc2626' :
    data.prioridad.startsWith('Media') ? '#d97706' : '#16a34a';

  const fieldRow = (label: string, value: string) => `
    <tr>
      <td class="label">${label}</td>
      <td class="value">${value || '—'}</td>
    </tr>`;

  const blockField = (label: string, value: string, accent: string) => `
    <div class="block-field">
      <div class="block-label">
        <div class="accent-bar" style="background:${accent}"></div>
        <span>${label}</span>
      </div>
      <p class="block-value">${(value || '—').replace(/\n/g, '<br/>')}</p>
    </div>`;

  const sectionTitle = (num: string, title: string) => `
    <div class="section-title">
      <span class="section-num">${num}</span>
      <span class="section-name">${title}</span>
      <div class="section-line"></div>
    </div>`;

  const evidenciaUrlHtml = data.evidenciaUrl ? `
    <div class="block-field">
      <div class="block-label">
        <div class="accent-bar" style="background:#d97706"></div>
        <span>Enlace OneDrive</span>
      </div>
      <p class="block-value">
        <a href="${data.evidenciaUrl}" target="_blank" style="color:#7c3aed; text-decoration:underline; word-break:break-all;">
          ${data.evidenciaUrl}
        </a>
      </p>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Plan de Mejoramiento Institucional</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4 portrait; margin: 0; }
    html, body {
      width: 210mm;
      min-height: 297mm;
      background: white;
      font-family: 'Segoe UI', Arial, sans-serif;
      font-size: 10pt;
      color: #1f2937;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header {
      background: #1e0a4a;
      color: white;
      padding: 22px 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1.5rem;
    }
    .header-left .supra {
      font-size: 7.5pt;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #c4b5fd;
      margin-bottom: 5px;
    }
    .header-left h1 {
      font-size: 15pt;
      font-weight: 700;
      line-height: 1.2;
      color: white;
    }
    .header-left .sub {
      font-size: 8.5pt;
      color: #ddd6fe;
      margin-top: 4px;
    }
    .header-right {
      text-align: right;
      flex-shrink: 0;
    }
    .header-right .date-label {
      font-size: 7.5pt;
      color: #c4b5fd;
      margin-bottom: 3px;
    }
    .header-right .date-value {
      font-size: 9.5pt;
      font-weight: 600;
      color: white;
    }
    .prio-bar {
      background: ${prioColor};
      color: white;
      padding: 5px 36px;
      font-size: 7.5pt;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .body {
      padding: 22px 36px 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 7px;
    }
    .section-num  { font-size: 7.5pt; font-weight: 700; color: #7c3aed; }
    .section-name { font-size: 7.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #6b7280; }
    .section-line { flex: 1; height: 1px; background: #e5e7eb; }
    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    tr:nth-child(odd)  { background: #f9fafb; }
    tr:nth-child(even) { background: white; }
    td { padding: 6px 14px; vertical-align: baseline; }
    td.label {
      font-size: 7.5pt;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      width: 190px;
      white-space: nowrap;
    }
    td.value {
      font-size: 9.5pt;
      color: #1f2937;
      font-weight: 500;
    }
    .block-wrap {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      overflow: hidden;
    }
    .block-field {
      padding: 9px 14px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    .block-field:first-child { border-top: none; }
    .block-label {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 4px;
    }
    .accent-bar {
      width: 3px;
      height: 13px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    .block-label span {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9ca3af;
    }
    .block-value {
      font-size: 9.5pt;
      color: #1f2937;
      line-height: 1.5;
      padding-left: 10px;
      word-break: break-word;
    }
    .date-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .date-card {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 9px 14px;
      background: #f9fafb;
    }
    .date-card .date-label {
      font-size: 7.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #9ca3af;
      margin-bottom: 3px;
    }
    .date-card .date-value {
      font-size: 10.5pt;
      font-weight: 600;
      color: #1f2937;
    }
    .firmas {
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid #d1d5db;
    }
    .firmas-row {
      display: flex;
      justify-content: space-around;
      gap: 2rem;
    }
    .firma-item {
      flex: 1;
      text-align: center;
    }
    .firma-line {
      border-bottom: 1px solid #374151;
      margin-bottom: 5px;
      margin-top: 44px;
    }
    .firma-label {
      font-size: 7pt;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }
    .footer-text {
      text-align: center;
      font-size: 6.5pt;
      color: #9ca3af;
      margin-top: 16px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <p class="supra">Sistema de Gestión Institucional</p>
      <h1>Plan de Mejoramiento Institucional</h1>
      <p class="sub">Documento de seguimiento y control · ECAPI</p>
    </div>
    <div class="header-right">
      <p class="date-label">Fecha de generación</p>
      <p class="date-value">${today}</p>
    </div>
  </div>
  ${data.prioridad ? `<div class="prio-bar">Prioridad: ${data.prioridad}</div>` : ''}
  <div class="body">
    <section>
      ${sectionTitle('01', 'Identificación PDI')}
      <table>
        ${fieldRow('Frente PDI relacionado', data.frentePDI)}
        ${fieldRow('Factor Primario - Macroproceso', data.nivel1)}
        ${fieldRow('Factor Secundario - Proceso y Riesgo', data.nivel2)}
      </table>
    </section>
    <section>
      ${sectionTitle('02', 'Unidad Responsable')}
      <table>
        ${fieldRow('Vicerrectoría / Escuelas', data.vicerrectoria)}
        ${fieldRow('Área / Programa', data.areaPrograma)}
        ${fieldRow('Cargo Responsable', data.cargoResponsable)}
        ${fieldRow('Iniciativa relacionada', data.iniciativa)}
      </table>
    </section>
    <section>
      ${sectionTitle('03', 'Plan de Acción')}
      <div class="block-wrap">
        ${blockField('Acción de mejora', data.accionMejora, '#7c3aed')}
        ${blockField('Meta', data.meta, '#2563eb')}
        ${blockField('Actividad', data.actividad, '#0891b2')}
      </div>
    </section>
    <section>
      ${sectionTitle('04', 'Cronograma')}
      <div class="date-grid">
        <div class="date-card">
          <p class="date-label">Fecha de inicio</p>
          <p class="date-value">${formatDate(data.fechaInicio)}</p>
        </div>
        <div class="date-card">
          <p class="date-label">Fecha de cierre</p>
          <p class="date-value">${formatDate(data.fechaCierre)}</p>
        </div>
      </div>
    </section>
    <section>
      ${sectionTitle('05', 'Seguimiento')}
      <div class="block-wrap">
        ${blockField('Avance', data.avance, '#16a34a')}
        ${blockField('Descripción de evidencia', data.evidencia, '#d97706')}
        ${evidenciaUrlHtml}
      </div>
    </section>
    <div class="firmas">
      <div class="firmas-row">
        <div class="firma-item">
          <div class="firma-line"></div>
          <p class="firma-label">Responsable de Área</p>
        </div>
        <div class="firma-item">
          <div class="firma-line"></div>
          <p class="firma-label">Vicerrectoría / Decanatura</p>
        </div>
        <div class="firma-item">
          <div class="firma-line"></div>
          <p class="firma-label">Aprobación Institucional</p>
        </div>
      </div>
      <p class="footer-text">Generado mediante ECAPI — Sistema de Gestión Institucional Inteligente</p>
    </div>
  </div>
  <script>
    window.onload = () => { window.print(); };
  </script>
</body>
</html>`;
}

/* ─── Componente principal ─── */
export default function SuccessScreen({ data, onBack, onNew }: SuccessScreenProps) {
  const today = new Date().toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const formatDate = (d: string) =>
    d ? new Date(d + 'T00:00:00').toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    }) : '—';

  const prioColor =
    data.prioridad.startsWith('Alta')  ? '#dc2626' :
    data.prioridad.startsWith('Media') ? '#d97706' : '#16a34a';

  const handlePrint = () => {
    const html = buildPrintHTML(data, today, formatDate);
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  };

  const handleExportExcel = () => {
    exportToExcel(data);
  };

  const handleOpenUrl = () => {
    if (data.evidenciaUrl) {
      window.open(data.evidenciaUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col w-full pb-20"
    >
      {/* ── Barra de acciones ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <button
          onClick={onNew}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={18} /> Página principal
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:border-violet-500/50 hover:text-white transition-all text-sm"
          >
            <RotateCcw size={15} /> Volver a editar
          </button>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:border-violet-500/50 hover:text-white transition-all text-sm"
          >
            <FilePlus2 size={15} /> Nuevo plan
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium transition-all shadow-[0_0_18px_rgba(34,197,94,0.35)] text-sm"
          >
            <FileSpreadsheet size={15} /> Exportar a Excel
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium transition-all shadow-[0_0_18px_rgba(139,92,246,0.35)] text-sm"
          >
            <Printer size={15} /> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Vista previa en pantalla - mantén el mismo código que ya tenías */}
      <div
        className="w-full bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        style={{ fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '11pt' }}
      >
        {/* Cabecera */}
        <div style={{ backgroundColor: '#1e0a4a', color: 'white', padding: '22px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '8pt', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c4b5fd', marginBottom: '5px' }}>Sistema de Gestión Institucional</p>
            <h1 style={{ fontSize: '16pt', fontWeight: 700, lineHeight: 1.2, margin: 0, color: 'white' }}>Plan de Mejoramiento Institucional</h1>
            <p style={{ fontSize: '9pt', color: '#ddd6fe', marginTop: '4px' }}>Documento de seguimiento y control · ECAPI</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: '8pt', color: '#c4b5fd', marginBottom: '3px' }}>Fecha de generación</p>
            <p style={{ fontSize: '10pt', fontWeight: 600, color: 'white' }}>{today}</p>
          </div>
        </div>

        {/* Franja prioridad */}
        {data.prioridad && (
          <div style={{ backgroundColor: prioColor, color: 'white', padding: '5px 36px', fontSize: '8pt', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Prioridad: {data.prioridad}
          </div>
        )}

        {/* Cuerpo */}
        <div style={{ padding: '22px 36px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <PreviewSection number="01" title="Identificación PDI">
            <PreviewTable>
              <PreviewRow label="Frente PDI relacionado" value={data.frentePDI} />
              <PreviewRow label="Factor Primario - Macroproceso" value={data.nivel1} />
              <PreviewRow label="Factor Secundario - Proceso y Riesgo" value={data.nivel2} />
            </PreviewTable>
          </PreviewSection>

          <PreviewSection number="02" title="Unidad Responsable">
            <PreviewTable>
              <PreviewRow label="Vicerrectoría / Escuelas" value={data.vicerrectoria} />
              <PreviewRow label="Área / Programa" value={data.areaPrograma} />
              <PreviewRow label="Cargo Responsable" value={data.cargoResponsable} />
              <PreviewRow label="Iniciativa relacionada" value={data.iniciativa} />
            </PreviewTable>
          </PreviewSection>

          <PreviewSection number="03" title="Plan de Acción">
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
              <PreviewBlock label="Acción de mejora" value={data.accionMejora} accent="#7c3aed" />
              <PreviewBlock label="Meta" value={data.meta} accent="#2563eb" border />
              <PreviewBlock label="Actividad" value={data.actividad} accent="#0891b2" border />
            </div>
          </PreviewSection>

          <PreviewSection number="04" title="Cronograma">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <PreviewDateCard label="Fecha de inicio" value={formatDate(data.fechaInicio)} />
              <PreviewDateCard label="Fecha de cierre" value={formatDate(data.fechaCierre)} />
            </div>
          </PreviewSection>

          <PreviewSection number="05" title="Seguimiento">
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>
              <PreviewBlock label="Avance" value={data.avance} accent="#16a34a" />
              <PreviewBlock label="Descripción de evidencia" value={data.evidencia} accent="#d97706" border />
              {data.evidenciaUrl && (
                <PreviewBlockUrl label="Enlace OneDrive" value={data.evidenciaUrl} accent="#d97706" border onOpen={handleOpenUrl} />
              )}
            </div>
          </PreviewSection>

          {/* Firmas */}
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #d1d5db' }}>
            <p style={{ textAlign: 'center', fontSize: '7pt', color: '#9ca3af', marginTop: '16px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Generado por la herramienta del Plan Unico De Mejoras — ECOSISTEMA INTELIGENTE DE GESTIÓN INSTITUCIONAL
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Sub-componentes de vista previa ── */
function PreviewSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
        <span style={{ fontSize: '8pt', fontWeight: 700, color: '#7c3aed' }}>{number}</span>
        <span style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6b7280' }}>{title}</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
      </div>
      {children}
    </section>
  );
}

function PreviewTable({ children }: { children: React.ReactNode }) {
  return <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', overflow: 'hidden' }}>{children}</div>;
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', padding: '6px 14px', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: '8pt', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.07em', width: '220px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '10pt', color: '#1f2937', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

function PreviewBlock({ label, value, accent, border }: { label: string; value: string; accent: string; border?: boolean }) {
  return (
    <div style={{ padding: '9px 14px', backgroundColor: 'white', borderTop: border ? '1px solid #e5e7eb' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
        <div style={{ width: '3px', height: '13px', borderRadius: '2px', backgroundColor: accent, flexShrink: 0 }} />
        <span style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>{label}</span>
      </div>
      <p style={{ fontSize: '10pt', color: '#1f2937', lineHeight: 1.5, margin: 0, paddingLeft: '10px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{value || '—'}</p>
    </div>
  );
}

function PreviewBlockUrl({ label, value, accent, border, onOpen }: { label: string; value: string; accent: string; border?: boolean; onOpen: () => void }) {
  return (
    <div style={{ padding: '9px 14px', backgroundColor: 'white', borderTop: border ? '1px solid #e5e7eb' : undefined }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '4px' }}>
        <div style={{ width: '3px', height: '13px', borderRadius: '2px', backgroundColor: accent, flexShrink: 0 }} />
        <span style={{ fontSize: '8pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '10px' }}>
        <Link2 size={12} style={{ color: '#7c3aed', flexShrink: 0 }} />
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onOpen(); }}
          style={{ fontSize: '10pt', color: '#7c3aed', textDecoration: 'underline', wordBreak: 'break-all', cursor: 'pointer' }}
        >
          {value}
        </a>
        <ExternalLink size={10} style={{ color: '#9ca3af', flexShrink: 0 }} />
      </div>
    </div>
  );
}

function PreviewDateCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '6px', padding: '9px 14px', backgroundColor: '#f9fafb' }}>
      <p style={{ fontSize: '8pt', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 3px 0' }}>{label}</p>
      <p style={{ fontSize: '11pt', fontWeight: 600, color: '#1f2937', margin: 0 }}>{value}</p>
    </div>
  );
}