import XLSXStyle from 'xlsx-js-style';
import type { PlanData } from '../App';

// ─── Paleta de colores (mismos del PDF) ──────────────────────────────────────
const C = {
  DARK_TEAL:        '1A3A4A',
  MID_TEAL:         '2A5A6A',
  ACCENT_TEAL:      'A8D5E0',
  VERY_LIGHT_TEAL:  'E8F4F7',
  WHITE:            'FFFFFF',
  LIGHT_GRAY:       'F5F5F5',
  DARK_TEXT:        '1A2530',
  MUTED:            '888888',
  BORDER:           'B0CDD5',
} as const;

// Helper para forzar tipo de color (soluciona el error de TypeScript)
const asColor = (color: string): string => color as string;

// ─── Helpers de estilo ────────────────────────────────────────────────────────
type HAlign = 'left' | 'center' | 'right';

const border = (color: string = C.BORDER) => ({
  top:    { style: 'thin' as const, color: { rgb: color } },
  bottom: { style: 'thin' as const, color: { rgb: color } },
  left:   { style: 'thin' as const, color: { rgb: color } },
  right:  { style: 'thin' as const, color: { rgb: color } },
});

const cell = (
  value: string,
  bgColor: string,
  fontColor: string,
  bold = false,
  size = 10,
  hAlign: HAlign = 'left',
  italic = false,
  hasBorder = true,
): XLSXStyle.CellObject => ({
  v: value,
  t: 's' as const,
  s: {
    fill:      { fgColor: { rgb: bgColor } },
    font:      { name: 'Arial', sz: size, bold, italic, color: { rgb: fontColor } },
    alignment: { horizontal: hAlign, vertical: 'center', wrapText: true },
    border:    hasBorder ? border() : undefined,
  },
});

const emptyCell = (bgColor: string = C.WHITE): XLSXStyle.CellObject => ({
  v: '',
  t: 's' as const,
  s: { fill: { fgColor: { rgb: bgColor } } },
});

// ─── Formato de fechas ────────────────────────────────────────────────────────
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  try {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return '—';
  }
};

// ─── Constructor principal ────────────────────────────────────────────────────
export const exportToExcel = (data: PlanData): void => {

  // Cada elemento del array = una fila = [colA, colB, colC, colD, colE]
  const rows: XLSXStyle.CellObject[][] = [];

  // ── Helper: fila de margen vacío ─────────────────────────────────────────
  const marginRow = (bg: string = C.WHITE, height = 8) => {
    const r = [emptyCell(bg), emptyCell(bg), emptyCell(bg), emptyCell(bg), emptyCell(bg)];
    (r as any)._height = height;
    return r;
  };

  // ── Helper: fila de encabezado de sección ────────────────────────────────
  const sectionHeader = (num: string, title: string) => {
    const r = [
      emptyCell(C.WHITE),
      cell(`${num}  ${title}`, C.MID_TEAL, C.WHITE, true, 11, 'left'),
      emptyCell(C.MID_TEAL),
      emptyCell(C.MID_TEAL),
      emptyCell(C.WHITE),
    ];
    (r as any)._height = 24;
    (r as any)._mergeBC = true;
    return r;
  };

  // ── Helper: fila de dato ─────────────────────────────────────────────────
  const dataRow = (label: string, value: string, height = 20) => {
    const r = [
      emptyCell(C.WHITE),
      cell(label, C.VERY_LIGHT_TEAL, C.DARK_TEXT, true, 9, 'left'),
      cell(value || '—', C.WHITE, C.DARK_TEXT, false, 9, 'left'),
      emptyCell(C.WHITE),
      emptyCell(C.WHITE),
    ];
    (r as any)._height = height;
    (r as any)._mergeCD = true;
    return r;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ENCABEZADO PRINCIPAL
  // ══════════════════════════════════════════════════════════════════════════

  rows.push(marginRow(C.DARK_TEAL, 14));

  const r1 = [
    emptyCell(C.DARK_TEAL),
    cell('SISTEMA DE GESTIÓN INSTITUCIONAL', C.DARK_TEAL, C.WHITE, true, 12, 'center'),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
  ];
  (r1 as any)._height = 26;
  (r1 as any)._mergeBD = true;
  rows.push(r1);

  const r2 = [
    emptyCell(C.DARK_TEAL),
    cell('Plan de Mejoramiento Institucional', C.DARK_TEAL, C.WHITE, true, 20, 'center'),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
  ];
  (r2 as any)._height = 38;
  (r2 as any)._mergeBD = true;
  rows.push(r2);

  const r3 = [
    emptyCell(C.DARK_TEAL),
    cell('Documento de seguimiento y control · PLAN UM', C.DARK_TEAL, C.ACCENT_TEAL, false, 10, 'center', true),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
  ];
  (r3 as any)._height = 18;
  (r3 as any)._mergeBD = true;
  rows.push(r3);

  const now = new Date();
  const fechaGen = now.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const r4 = [
    emptyCell(C.DARK_TEAL),
    cell(`Fecha de generación: ${fechaGen}`, C.DARK_TEAL, C.WHITE, false, 9, 'center'),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
    emptyCell(C.DARK_TEAL),
  ];
  (r4 as any)._height = 20;
  (r4 as any)._mergeBD = true;
  rows.push(r4);

  const prioLabel = data.prioridad
    ? `PRIORIDAD: ${data.prioridad.toUpperCase()}`
    : 'PRIORIDAD: BAJA — RIESGO BAJO';
  const r5 = [
    emptyCell(C.ACCENT_TEAL),
    cell(prioLabel, C.ACCENT_TEAL, C.DARK_TEAL, true, 10, 'center'),
    emptyCell(C.ACCENT_TEAL),
    emptyCell(C.ACCENT_TEAL),
    emptyCell(C.ACCENT_TEAL),
  ];
  (r5 as any)._height = 22;
  (r5 as any)._mergeBD = true;
  rows.push(r5);

  rows.push(marginRow(C.WHITE, 8));

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 01: IDENTIFICACIÓN PDI
  // ══════════════════════════════════════════════════════════════════════════
  rows.push(sectionHeader('01', 'IDENTIFICACIÓN PDI'));
  rows.push(dataRow('FRENTE PDI RELACIONADO', data.frentePDI || '—'));
  rows.push(dataRow('FACTOR PRIMARIO - MACROPROCESO', data.nivel1 || '—'));
  rows.push(dataRow('FACTOR SECUNDARIO - PROCESO Y RIESGO', data.nivel2 || '—'));
  rows.push(marginRow(C.WHITE, 8));

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 02: UNIDAD RESPONSABLE
  // ══════════════════════════════════════════════════════════════════════════
  rows.push(sectionHeader('02', 'UNIDAD RESPONSABLE'));
  rows.push(dataRow('VICERRECTORÍA / ESCUELAS', data.vicerrectoria || '—'));
  rows.push(dataRow('ÁREA / PROGRAMA', data.areaPrograma || '—'));
  rows.push(dataRow('CARGO RESPONSABLE', data.cargoResponsable || '—'));
  rows.push(dataRow('INICIATIVA RELACIONADA', data.iniciativa || '—'));
  rows.push(marginRow(C.WHITE, 8));

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 03: PLAN DE ACCIÓN
  // ══════════════════════════════════════════════════════════════════════════
  rows.push(sectionHeader('03', 'PLAN DE ACCIÓN'));
  rows.push(dataRow('ACCIÓN DE MEJORA', data.accionMejora || '—', 55));
  rows.push(dataRow('META', data.meta || '—', 55));
  rows.push(dataRow('ACTIVIDAD', data.actividad || '—', 55));
  rows.push(marginRow(C.WHITE, 8));

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 04: CRONOGRAMA
  // ══════════════════════════════════════════════════════════════════════════
  rows.push(sectionHeader('04', 'CRONOGRAMA'));
  rows.push(dataRow('FECHA DE INICIO', formatDate(data.fechaInicio)));
  rows.push(dataRow('FECHA DE CIERRE', formatDate(data.fechaCierre)));
  rows.push(marginRow(C.WHITE, 8));

  // ══════════════════════════════════════════════════════════════════════════
  // SECCIÓN 05: SEGUIMIENTO
  // ══════════════════════════════════════════════════════════════════════════
  rows.push(sectionHeader('05', 'SEGUIMIENTO'));
  rows.push(dataRow('AVANCE', data.avance || '—'));
  rows.push(dataRow('DESCRIPCIÓN DE EVIDENCIA', data.evidencia || '—', 45));
  rows.push(dataRow('ENLACE ONEDRIVE', data.evidenciaUrl || '—'));
  rows.push(marginRow(C.WHITE, 8));

  // Footer
  const rFooter = [
    emptyCell(C.WHITE),
    cell('GENERADO MEDIANTE Plan Unico De Mejoras — SISTEMA DE GESTIÓN INSTITUCIONAL INTELIGENTE', C.WHITE, C.MUTED, false, 8, 'center', true, false),
    emptyCell(C.WHITE),
    emptyCell(C.WHITE),
    emptyCell(C.WHITE),
  ];
  (rFooter as any)._height = 16;
  (rFooter as any)._mergeBD = true;
  rows.push(rFooter);

  // ══════════════════════════════════════════════════════════════════════════
  // CONSTRUIR WORKSHEET
  // ══════════════════════════════════════════════════════════════════════════
  const ws: XLSXStyle.WorkSheet = {};
  const colLetters = ['A', 'B', 'C', 'D', 'E'];
  const merges: XLSXStyle.Range[] = [];
  const rowHeights: { hpt: number }[] = [];

  rows.forEach((row, ri) => {
    const h = (row as any)._height ?? 20;
    rowHeights.push({ hpt: h });

    const isMergeBD = (row as any)._mergeBD;
    const isMergeBC = (row as any)._mergeBC;
    const isMergeCD = (row as any)._mergeCD;

    row.forEach((cellObj, ci) => {
      const addr = `${colLetters[ci]}${ri + 1}`;
      ws[addr] = cellObj;
    });

    if (isMergeBD || isMergeBC) {
      merges.push({ s: { r: ri, c: 1 }, e: { r: ri, c: 3 } });
    }
    if (isMergeCD) {
      merges.push({ s: { r: ri, c: 2 }, e: { r: ri, c: 3 } });
    }
  });

  ws['!ref'] = `A1:E${rows.length}`;
  ws['!cols'] = [
    { wch: 3 },  // A — margen
    { wch: 28 }, // B — etiqueta
    { wch: 35 }, // C — valor parte 1
    { wch: 25 }, // D — valor parte 2 (merged con C)
    { wch: 3 },  // E — margen
  ];
  ws['!rows'] = rowHeights;
  ws['!merges'] = merges;
  ws['!sheetView'] = { showGridLines: false } as any;

  // ══════════════════════════════════════════════════════════════════════════
  // EXPORTAR
  // ══════════════════════════════════════════════════════════════════════════
  const wb = XLSXStyle.utils.book_new();
  XLSXStyle.utils.book_append_sheet(wb, ws, 'Plan de Mejoramiento');

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  XLSXStyle.writeFile(wb, `Plan_Mejoramiento_${timestamp}.xlsx`);
};