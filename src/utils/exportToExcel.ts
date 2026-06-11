import XLSXStyle from 'xlsx-js-style';
import type { PlanData } from '../App';

// ─── Paleta de colores institucional ─────────────────────────────────────────
const C = {
  NAVY:         '2e5871',   // azul oscuro principal
  TEAL:         '008b8b',   // teal institucional
  ORANGE:       'e15e29',   // naranja acento
  GOLD:         'd1b742',   // dorado acento
  WHITE:        'FFFFFF',
  BLACK:        '000000',
  TEAL_LIGHT:   'E0F4F4',   // fondo filas de dato
  NAVY_LIGHT:   'E8EFF3',   // fondo alterno
  TEAL_MID:     '006666',   // teal oscuro para texto sobre claro
  BORDER:       'B0D4D4',   // borde suave teal
  MUTED:        '888888',
} as const;

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
  v: '', t: 's' as const,
  s: { fill: { fgColor: { rgb: bgColor } } },
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return '—'; }
};

// ─── Constructor principal ────────────────────────────────────────────────────
export const exportToExcel = (data: PlanData): void => {

  const rows: XLSXStyle.CellObject[][] = [];

  const marginRow = (bg: string = C.WHITE, height = 8) => {
    const r = [emptyCell(bg), emptyCell(bg), emptyCell(bg), emptyCell(bg), emptyCell(bg)];
    (r as any)._height = height;
    return r;
  };

  // Encabezado de sección — naranja institucional
  const sectionHeader = (num: string, title: string) => {
    const r = [
      emptyCell(C.WHITE),
      cell(`${num}  ${title}`, C.ORANGE, C.WHITE, true, 11, 'left'),
      emptyCell(C.ORANGE),
      emptyCell(C.ORANGE),
      emptyCell(C.WHITE),
    ];
    (r as any)._height = 24;
    (r as any)._mergeBC = true;
    return r;
  };

  // Fila de dato — etiqueta teal, valor blanco
  const dataRow = (label: string, value: string, height = 20) => {
    const r = [
      emptyCell(C.WHITE),
      cell(label, C.TEAL_LIGHT, C.TEAL_MID, true, 9, 'left'),
      cell(value || '—', C.WHITE, C.BLACK, false, 9, 'left'),
      emptyCell(C.WHITE),
      emptyCell(C.WHITE),
    ];
    (r as any)._height = height;
    (r as any)._mergeCD = true;
    return r;
  };

  // ── ENCABEZADO PRINCIPAL ──────────────────────────────────────────────────
  rows.push(marginRow(C.NAVY, 14));

  const r1 = [
    emptyCell(C.NAVY),
    cell('SISTEMA DE GESTIÓN INSTITUCIONAL', C.NAVY, C.GOLD, true, 10, 'center'),
    emptyCell(C.NAVY), emptyCell(C.NAVY), emptyCell(C.NAVY),
  ];
  (r1 as any)._height = 22; (r1 as any)._mergeBD = true;
  rows.push(r1);

  const r2 = [
    emptyCell(C.NAVY),
    cell('Plan Único de Mejoras', C.NAVY, C.WHITE, true, 22, 'center'),
    emptyCell(C.NAVY), emptyCell(C.NAVY), emptyCell(C.NAVY),
  ];
  (r2 as any)._height = 40; (r2 as any)._mergeBD = true;
  rows.push(r2);

  const r3 = [
    emptyCell(C.NAVY),
    cell('Documento de seguimiento y control · PLAN UM', C.NAVY, C.TEAL, false, 10, 'center', true),
    emptyCell(C.NAVY), emptyCell(C.NAVY), emptyCell(C.NAVY),
  ];
  (r3 as any)._height = 18; (r3 as any)._mergeBD = true;
  rows.push(r3);

  const fechaGen = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
  const r4 = [
    emptyCell(C.NAVY),
    cell(`Fecha de generación: ${fechaGen}`, C.NAVY, C.WHITE, false, 9, 'center'),
    emptyCell(C.NAVY), emptyCell(C.NAVY), emptyCell(C.NAVY),
  ];
  (r4 as any)._height = 20; (r4 as any)._mergeBD = true;
  rows.push(r4);

  // Franja de tipo de plan + prioridad
  const tipoPlanLabel = data.tipoPlan ? `TIPO DE PLAN: ${data.tipoPlan.toUpperCase()}` : 'TIPO DE PLAN: —';
  const prioLabel = data.prioridad ? `PRIORIDAD: ${data.prioridad.toUpperCase()}` : 'PRIORIDAD: —';
  const r5 = [
    emptyCell(C.TEAL),
    cell(`${tipoPlanLabel}   ·   ${prioLabel}`, C.TEAL, C.WHITE, true, 10, 'center'),
    emptyCell(C.TEAL), emptyCell(C.TEAL), emptyCell(C.TEAL),
  ];
  (r5 as any)._height = 22; (r5 as any)._mergeBD = true;
  rows.push(r5);

  // Franja de año
  if (data.año) {
    const r6 = [
      emptyCell(C.GOLD),
      cell(`AÑO: ${data.año}`, C.GOLD, C.BLACK, true, 10, 'center'),
      emptyCell(C.GOLD), emptyCell(C.GOLD), emptyCell(C.GOLD),
    ];
    (r6 as any)._height = 18; (r6 as any)._mergeBD = true;
    rows.push(r6);
  }

  rows.push(marginRow(C.WHITE, 8));

  // ── SECCIÓN 01: IDENTIFICACIÓN PDI ───────────────────────────────────────
  rows.push(sectionHeader('01', 'IDENTIFICACIÓN PDI'));
  rows.push(dataRow('FRENTE PDI RELACIONADO',              data.frentePDI   || '—'));
  rows.push(dataRow('FACTOR PRIMARIO — MACROPROCESO',      data.nivel1      || '—'));
  rows.push(dataRow('FACTOR SECUNDARIO — PROCESO Y RIESGO',data.nivel2      || '—'));
  rows.push(marginRow(C.WHITE, 8));

  // ── SECCIÓN 02: UNIDAD RESPONSABLE ───────────────────────────────────────
  rows.push(sectionHeader('02', 'UNIDAD RESPONSABLE'));
  rows.push(dataRow('VICERRECTORÍA / ESCUELAS',  data.vicerrectoria    || '—'));
  rows.push(dataRow('ÁREA / PROGRAMA',           data.areaPrograma     || '—'));
  rows.push(dataRow('CARGO RESPONSABLE',         data.cargoResponsable || '—'));
  rows.push(dataRow('INICIATIVA RELACIONADA',    data.iniciativa       || '—'));
  rows.push(marginRow(C.WHITE, 8));

  // ── SECCIÓN 03: INDICADORES (NUEVOS) ─────────────────────────────────────
  rows.push(sectionHeader('03', 'INDICADORES'));
  rows.push(dataRow('INDICADOR',   data.indicador || '—', 40));
  rows.push(dataRow('LÍNEA BASE',  data.lineaBase || '—'));
  rows.push(dataRow('MEDICIÓN',    data.medicion  || '—'));
  rows.push(marginRow(C.WHITE, 8));

  // ── SECCIÓN 04: PLAN DE ACCIÓN ────────────────────────────────────────────
  rows.push(sectionHeader('04', 'PLAN DE ACCIÓN'));
  rows.push(dataRow('ACCIÓN DE MEJORA', data.accionMejora || '—', 55));
  rows.push(dataRow('META',             data.meta         || '—', 55));
  rows.push(dataRow('ACTIVIDAD',        data.actividad    || '—', 55));
  rows.push(marginRow(C.WHITE, 8));

  // ── SECCIÓN 05: CRONOGRAMA ────────────────────────────────────────────────
  rows.push(sectionHeader('05', 'CRONOGRAMA'));
  rows.push(dataRow('FECHA DE INICIO', formatDate(data.fechaInicio)));
  rows.push(dataRow('FECHA DE CIERRE', formatDate(data.fechaCierre)));
  rows.push(marginRow(C.WHITE, 8));

  // ── SECCIÓN 06: SEGUIMIENTO ───────────────────────────────────────────────
  rows.push(sectionHeader('06', 'SEGUIMIENTO'));
  rows.push(dataRow('AVANCE',                  data.avance    || '—', 45));
  rows.push(dataRow('DESCRIPCIÓN DE EVIDENCIA',data.evidencia || '—', 45));

  // URLs de evidencia
  const urlsValidas = (data.evidenciaUrls ?? []).filter(u => u.trim());
  if (urlsValidas.length > 0) {
    urlsValidas.forEach((url, i) => {
      rows.push(dataRow(`ENLACE ONEDRIVE ${urlsValidas.length > 1 ? i + 1 : ''}`.trim(), url));
    });
  } else if (data.evidenciaUrl) {
    rows.push(dataRow('ENLACE ONEDRIVE', data.evidenciaUrl));
  }

  rows.push(marginRow(C.WHITE, 8));

  // Footer
  const rFooter = [
    emptyCell(C.WHITE),
    cell(
      'Generado mediante Plan Único de Mejoras — Sistema de Gestión Institucional Inteligente · UNIMINUTO',
      C.WHITE, C.MUTED, false, 8, 'center', true, false
    ),
    emptyCell(C.WHITE), emptyCell(C.WHITE), emptyCell(C.WHITE),
  ];
  (rFooter as any)._height = 16; (rFooter as any)._mergeBD = true;
  rows.push(rFooter);

  // ── CONSTRUIR WORKSHEET ───────────────────────────────────────────────────
  const ws: XLSXStyle.WorkSheet = {};
  const colLetters = ['A', 'B', 'C', 'D', 'E'];
  const merges: XLSXStyle.Range[] = [];
  const rowHeights: { hpt: number }[] = [];

  rows.forEach((row, ri) => {
    rowHeights.push({ hpt: (row as any)._height ?? 20 });

    const isMergeBD = (row as any)._mergeBD;
    const isMergeBC = (row as any)._mergeBC;
    const isMergeCD = (row as any)._mergeCD;

    row.forEach((cellObj, ci) => {
      ws[`${colLetters[ci]}${ri + 1}`] = cellObj;
    });

    if (isMergeBD || isMergeBC) merges.push({ s: { r: ri, c: 1 }, e: { r: ri, c: 3 } });
    if (isMergeCD)               merges.push({ s: { r: ri, c: 2 }, e: { r: ri, c: 3 } });
  });

  ws['!ref']  = `A1:E${rows.length}`;
  ws['!cols'] = [
    { wch: 3  }, // A — margen
    { wch: 30 }, // B — etiqueta
    { wch: 35 }, // C — valor parte 1
    { wch: 20 }, // D — valor parte 2 (merged con C)
    { wch: 3  }, // E — margen
  ];
  ws['!rows']      = rowHeights;
  ws['!merges']    = merges;
  ws['!sheetView'] = { showGridLines: false } as any;

  // ── EXPORTAR ──────────────────────────────────────────────────────────────
  const wb = XLSXStyle.utils.book_new();
  XLSXStyle.utils.book_append_sheet(wb, ws, 'Plan de Mejoramiento');

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  XLSXStyle.writeFile(wb, `Plan_Mejoramiento_${timestamp}.xlsx`);
};