import {
  extractParameters,
  validateCrs,
  bboxToString,
  DateTimeParameterToCSAPIString,
  zParameterToString,
  ZParameter,
} from './helpers';
import { CSAPIParameter } from './model';

describe('CSAPI Helpers', () => {
  describe('extractParameters', () => {
    it('should return array of CSAPIParameter objects', () => {
      const input: Record<string, any> = {
        p1: { id: 'p1', name: 'param1', observedProperty: { label: { id: 'op1', en: 'Prop1' } }, unit: { label: { en: 'unit' }, symbol: { value: 'u', type: 'type' } } },
        p2: { id: 'p2', name: 'param2', observedProperty: { label: { id: 'op2', en: 'Prop2' } }, unit: { label: { en: 'unit2' }, symbol: { value: 'u2', type: 'type2' } } },
      };
      const result = extractParameters(input);
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('p1');
      expect(result[1].id).toBe('p2');
    });
  });

  describe('validateCrs', () => {
    const supported = ['EPSG:4326', 'EPSG:3857'];

    it('should return valid CRS', () => {
      expect(validateCrs('EPSG:4326', supported)).toBe('EPSG:4326');
    });

    it('should throw for unsupported CRS', () => {
      expect(() => validateCrs('EPSG:9999', supported)).toThrow(
        /Unsupported CRS: 'EPSG:9999'/
      );
    });
  });

  describe('bboxToString', () => {
    it('should convert valid bbox to string', () => {
      const bbox = [
        [0, 1],
        [2, 3],
      ];
      expect(bboxToString(bbox)).toBe('0,1,2,3');
    });

    it('should throw on invalid bbox', () => {
      expect(() => bboxToString([[0, 1]])).toThrow(/Invalid bbox format/);
    });
  });

  describe('DateTimeParameterToCSAPIString', () => {
    const toDate = (str: string) => new Date(str);

    it('serializes a plain Date', () => {
      const result = DateTimeParameterToCSAPIString(toDate('2025-01-01T00:00:00Z'));
      expect(result).toBe('2025-01-01T00:00:00.000Z');
    });

    it('serializes with only start', () => {
      const result = DateTimeParameterToCSAPIString({ start: toDate('2025-01-01T00:00:00Z') });
      expect(result).toBe('2025-01-01T00:00:00.000Z/..');
    });

    it('serializes with only end', () => {
      const result = DateTimeParameterToCSAPIString({ end: toDate('2025-12-31T23:59:59Z') });
      expect(result).toBe('../2025-12-31T23:59:59.000Z');
    });

    it('serializes with start and end', () => {
      const result = DateTimeParameterToCSAPIString({
        start: toDate('2025-01-01T00:00:00Z'),
        end: toDate('2025-12-31T23:59:59Z'),
      });
      expect(result).toBe('2025-01-01T00:00:00.000Z/2025-12-31T23:59:59.000Z');
    });

    it('throws if invalid', () => {
      expect(() => DateTimeParameterToCSAPIString({} as any)).toThrow();
    });
  });

  describe('zParameterToString', () => {
    it('handles single level', () => {
      const z: ZParameter = { type: 'single', level: 850 };
      expect(zParameterToString(z)).toBe('850');
    });

    it('handles interval', () => {
      const z: ZParameter = { type: 'interval', minLevel: 100, maxLevel: 550 };
      expect(zParameterToString(z)).toBe('100/550');
    });

    it('handles list', () => {
      const z: ZParameter = { type: 'list', levels: [10, 80, 200] };
      expect(zParameterToString(z)).toBe('10,80,200');
    });

    it('handles repeating', () => {
      const z: ZParameter = { type: 'repeating', repeat: 20, minLevel: 100, step: 50 };
      expect(zParameterToString(z)).toBe('R20/100/50');
    });
  });
});
