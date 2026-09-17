import { describe, expect, it } from 'vitest';
import {
  labelsFromRoll,
  linearRunMm,
  maxLabelsAcross,
  mmToDots,
  requiredRollDiameterMm,
  requiredWebWidthMm,
  ribbonsRequired,
  rollLengthMm,
  sheetLayout,
  thermalRibbonCapacity
} from '../src/lib/calculations';
import { fromMm, toMm } from '../src/lib/units';

describe('unit conversion', () => {
  it('converts inches to millimetres exactly', () => {
    expect(toMm(1, 'in')).toBe(25.4);
    expect(fromMm(25.4, 'in')).toBe(1);
  });

  it('converts micrometres and mil to millimetres', () => {
    expect(toMm(160, 'um')).toBeCloseTo(0.16, 8);
    expect(toMm(1, 'mil')).toBeCloseTo(0.0254, 8);
  });
});

describe('roll geometry', () => {
  it('calculates roll length from OD, core and thickness', () => {
    const length = rollLengthMm({ outerDiameterMm: 100, coreDiameterMm: 50, thicknessMm: 0.1 });
    expect(length).toBeCloseTo(Math.PI * 18750, 6);
  });

  it('calculates labels from web length and pitch', () => {
    const result = labelsFromRoll({
      outerDiameterMm: 100,
      coreDiameterMm: 50,
      thicknessMm: 0.1,
      pitchMm: 100,
      labelsAcross: 2
    });
    expect(result.repeats).toBe(Math.floor(result.lengthMm / 100));
    expect(result.labels).toBe(result.repeats * 2);
  });

  it('reverses web length into roll diameter', () => {
    const originalOd = 220;
    const core = 76;
    const thickness = 0.16;
    const web = rollLengthMm({ outerDiameterMm: originalOd, coreDiameterMm: core, thicknessMm: thickness });
    const pitch = 100;
    const labels = Math.floor(web / pitch);
    const reversed = requiredRollDiameterMm({
      labelCount: labels,
      labelsAcross: 1,
      pitchMm: pitch,
      coreDiameterMm: core,
      thicknessMm: thickness
    });
    expect(reversed.outerDiameterMm).toBeLessThanOrEqual(originalOd);
    expect(reversed.outerDiameterMm).toBeGreaterThan(originalOd - 1);
  });
});

describe('production geometry', () => {
  it('calculates linear run with labels across and setup waste', () => {
    const result = linearRunMm({ labelCount: 1000, labelsAcross: 2, pitchMm: 103, setupWasteMm: 1000 });
    expect(result.repeats).toBe(500);
    expect(result.runLengthMm).toBe(52500);
  });

  it('calculates required web width', () => {
    expect(requiredWebWidthMm({ labelWidthMm: 75, across: 3, horizontalGapMm: 3, sideTrimMm: 5 })).toBe(241);
  });

  it('calculates maximum columns in available web', () => {
    expect(maxLabelsAcross({ availableWebWidthMm: 250, labelWidthMm: 75, horizontalGapMm: 3, sideTrimMm: 5 })).toBe(3);
  });
});

describe('thermal printing', () => {
  it('calculates ribbon capacity and required ribbons', () => {
    const result = thermalRibbonCapacity({ ribbonLengthMm: 300000, pitchMm: 100, labelsAcross: 1, wastePercent: 0 });
    expect(result.labels).toBe(3000);
    expect(ribbonsRequired({ totalLabels: 10000, labelsPerRibbon: result.labels })).toBe(4);
  });

  it('converts millimetres to printer dots', () => {
    expect(mmToDots(101.6, 203)).toBe(812);
    expect(mmToDots(152.4, 203)).toBe(1218);
    expect(mmToDots(25.4, 300)).toBe(300);
  });
});

describe('sheet layout', () => {
  it('compares normal and rotated layouts', () => {
    const result = sheetLayout({
      sheetWidthMm: 210,
      sheetHeightMm: 297,
      labelWidthMm: 50,
      labelHeightMm: 30,
      marginLeftMm: 5,
      marginRightMm: 5,
      marginTopMm: 5,
      marginBottomMm: 5,
      horizontalGapMm: 2,
      verticalGapMm: 2
    });
    expect(result.normal.count).toBeGreaterThan(0);
    expect(result.rotated.count).toBeGreaterThan(0);
    expect(['normal', 'rotated']).toContain(result.best);
  });
});

describe('validation', () => {
  it('rejects impossible roll geometry', () => {
    expect(() => rollLengthMm({ outerDiameterMm: 50, coreDiameterMm: 76, thicknessMm: 0.1 })).toThrow();
  });
});
