import { assertNonNegative, assertPositive } from './units';

export interface RollGeometryInput {
  outerDiameterMm: number;
  coreDiameterMm: number;
  thicknessMm: number;
}

export function rollLengthMm(input: RollGeometryInput): number {
  const { outerDiameterMm, coreDiameterMm, thicknessMm } = input;
  assertPositive('Outer diameter', outerDiameterMm);
  assertPositive('Core diameter', coreDiameterMm);
  assertPositive('Material thickness', thicknessMm);
  if (outerDiameterMm <= coreDiameterMm) {
    throw new Error('Outer diameter must be greater than core diameter.');
  }
  return (Math.PI * (outerDiameterMm ** 2 - coreDiameterMm ** 2)) / (4 * thicknessMm);
}

export function labelsFromRoll(input: RollGeometryInput & { pitchMm: number; labelsAcross?: number }) {
  const pitchMm = input.pitchMm;
  const labelsAcross = Math.max(1, Math.floor(input.labelsAcross ?? 1));
  assertPositive('Label pitch', pitchMm);
  const lengthMm = rollLengthMm(input);
  const repeats = Math.floor(lengthMm / pitchMm);
  return {
    lengthMm,
    repeats,
    labels: repeats * labelsAcross,
    labelsAcross
  };
}

export function requiredRollDiameterMm(input: {
  labelCount: number;
  labelsAcross?: number;
  pitchMm: number;
  coreDiameterMm: number;
  thicknessMm: number;
  extraWebLengthMm?: number;
}) {
  const labelsAcross = Math.max(1, Math.floor(input.labelsAcross ?? 1));
  assertPositive('Label quantity', input.labelCount);
  assertPositive('Label pitch', input.pitchMm);
  assertPositive('Core diameter', input.coreDiameterMm);
  assertPositive('Material thickness', input.thicknessMm);
  const extraWebLengthMm = input.extraWebLengthMm ?? 0;
  assertNonNegative('Extra web length', extraWebLengthMm);
  const repeats = Math.ceil(input.labelCount / labelsAcross);
  const requiredLengthMm = repeats * input.pitchMm + extraWebLengthMm;
  const outerDiameterMm = Math.sqrt(
    input.coreDiameterMm ** 2 + (4 * input.thicknessMm * requiredLengthMm) / Math.PI
  );
  return { repeats, requiredLengthMm, outerDiameterMm, labelsAcross };
}

export function linearRunMm(input: {
  labelCount: number;
  labelsAcross?: number;
  pitchMm: number;
  setupWasteMm?: number;
}) {
  const labelsAcross = Math.max(1, Math.floor(input.labelsAcross ?? 1));
  assertPositive('Label quantity', input.labelCount);
  assertPositive('Label pitch', input.pitchMm);
  const setupWasteMm = input.setupWasteMm ?? 0;
  assertNonNegative('Setup waste', setupWasteMm);
  const repeats = Math.ceil(input.labelCount / labelsAcross);
  return {
    repeats,
    labelsAcross,
    runLengthMm: repeats * input.pitchMm + setupWasteMm
  };
}

export function requiredWebWidthMm(input: {
  labelWidthMm: number;
  across: number;
  horizontalGapMm?: number;
  sideTrimMm?: number;
}) {
  assertPositive('Label width', input.labelWidthMm);
  const across = Math.max(1, Math.floor(input.across));
  const horizontalGapMm = input.horizontalGapMm ?? 0;
  const sideTrimMm = input.sideTrimMm ?? 0;
  assertNonNegative('Horizontal gap', horizontalGapMm);
  assertNonNegative('Side trim', sideTrimMm);
  return across * input.labelWidthMm + (across - 1) * horizontalGapMm + 2 * sideTrimMm;
}

export function maxLabelsAcross(input: {
  availableWebWidthMm: number;
  labelWidthMm: number;
  horizontalGapMm?: number;
  sideTrimMm?: number;
}) {
  assertPositive('Available web width', input.availableWebWidthMm);
  assertPositive('Label width', input.labelWidthMm);
  const horizontalGapMm = input.horizontalGapMm ?? 0;
  const sideTrimMm = input.sideTrimMm ?? 0;
  assertNonNegative('Horizontal gap', horizontalGapMm);
  assertNonNegative('Side trim', sideTrimMm);
  const usable = input.availableWebWidthMm - 2 * sideTrimMm;
  if (usable < input.labelWidthMm) return 0;
  return Math.floor((usable + horizontalGapMm) / (input.labelWidthMm + horizontalGapMm));
}

export function thermalRibbonCapacity(input: {
  ribbonLengthMm: number;
  pitchMm: number;
  labelsAcross?: number;
  wastePercent?: number;
}) {
  assertPositive('Ribbon length', input.ribbonLengthMm);
  assertPositive('Label pitch', input.pitchMm);
  const labelsAcross = Math.max(1, Math.floor(input.labelsAcross ?? 1));
  const wastePercent = input.wastePercent ?? 0;
  if (!Number.isFinite(wastePercent) || wastePercent < 0 || wastePercent >= 100) {
    throw new Error('Waste percentage must be between 0 and 99.99.');
  }
  const usableLengthMm = input.ribbonLengthMm * (1 - wastePercent / 100);
  const repeats = Math.floor(usableLengthMm / input.pitchMm);
  return {
    usableLengthMm,
    repeats,
    labels: repeats * labelsAcross,
    labelsAcross
  };
}

export function ribbonsRequired(input: {
  totalLabels: number;
  labelsPerRibbon: number;
}) {
  assertPositive('Total labels', input.totalLabels);
  assertPositive('Labels per ribbon', input.labelsPerRibbon);
  return Math.ceil(input.totalLabels / input.labelsPerRibbon);
}

export function mmToDots(mm: number, dpi: number): number {
  assertPositive('Dimension', mm);
  assertPositive('DPI', dpi);
  return Math.round((mm / 25.4) * dpi);
}

function countAlong(usable: number, item: number, gap: number): number {
  if (usable < item) return 0;
  return Math.floor((usable + gap) / (item + gap));
}

export interface SheetLayoutInput {
  sheetWidthMm: number;
  sheetHeightMm: number;
  labelWidthMm: number;
  labelHeightMm: number;
  marginLeftMm?: number;
  marginRightMm?: number;
  marginTopMm?: number;
  marginBottomMm?: number;
  horizontalGapMm?: number;
  verticalGapMm?: number;
}

export function sheetLayout(input: SheetLayoutInput) {
  assertPositive('Sheet width', input.sheetWidthMm);
  assertPositive('Sheet height', input.sheetHeightMm);
  assertPositive('Label width', input.labelWidthMm);
  assertPositive('Label height', input.labelHeightMm);
  const ml = input.marginLeftMm ?? 0;
  const mr = input.marginRightMm ?? 0;
  const mt = input.marginTopMm ?? 0;
  const mb = input.marginBottomMm ?? 0;
  const hg = input.horizontalGapMm ?? 0;
  const vg = input.verticalGapMm ?? 0;
  [ml, mr, mt, mb, hg, vg].forEach((v) => assertNonNegative('Margin/gap', v));
  const usableW = input.sheetWidthMm - ml - mr;
  const usableH = input.sheetHeightMm - mt - mb;
  if (usableW <= 0 || usableH <= 0) throw new Error('Margins leave no usable sheet area.');

  const normalCols = countAlong(usableW, input.labelWidthMm, hg);
  const normalRows = countAlong(usableH, input.labelHeightMm, vg);
  const rotatedCols = countAlong(usableW, input.labelHeightMm, hg);
  const rotatedRows = countAlong(usableH, input.labelWidthMm, vg);

  const normalCount = normalCols * normalRows;
  const rotatedCount = rotatedCols * rotatedRows;
  const normalArea = normalCount * input.labelWidthMm * input.labelHeightMm;
  const rotatedArea = rotatedCount * input.labelWidthMm * input.labelHeightMm;
  const sheetArea = input.sheetWidthMm * input.sheetHeightMm;

  return {
    normal: { columns: normalCols, rows: normalRows, count: normalCount, utilization: normalArea / sheetArea },
    rotated: { columns: rotatedCols, rows: rotatedRows, count: rotatedCount, utilization: rotatedArea / sheetArea },
    best: rotatedCount > normalCount ? 'rotated' as const : 'normal' as const
  };
}
