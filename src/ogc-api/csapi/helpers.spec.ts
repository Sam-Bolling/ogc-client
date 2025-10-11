import {
  ZParameter,
  zParameterToString,
  optionalAreaParams,
  optionalLocationParams,
  optionalCubeParams,
  optionalTrajectoryParams,
  optionalCorridorParams,
  optionalPositionParams,
  optionalRadiusParams,
} from './model.js';
import { DateTimeParameter } from '../../shared/models.js';

describe('zParameterToString', () => {
  test('single level', () => {
    const z: ZParameter = { type: 'single', level: 850 };
    expect(zParameterToString(z)).toBe('850');
  });

  test('interval (min/max)', () => {
    const z: ZParameter = { type: 'interval', minLevel: 100, maxLevel: 550 };
    expect(zParameterToString(z)).toBe('100/550');
  });

  test('list of levels', () => {
    const z: ZParameter = { type: 'list', levels: [10, 80, 200] };
    expect(zParameterToString(z)).toBe('10,80,200');
  });

  test('repeating interval', () => {
    const z: ZParameter = {
      type: 'repeating',
      repeat: 20,
      minLevel: 100,
      step: 50,
    };
    expect(zParameterToString(z)).toBe('R20/100/50');
  });

  test('list with single element should still stringify correctly', () => {
    const z: ZParameter = { type: 'list', levels: [42] };
    expect(zParameterToString(z)).toBe('42');
  });

  test('interval minLevel greater than maxLevel still produces string', () => {
    const z: ZParameter = { type: 'interval', minLevel: 500, maxLevel: 100 };
    expect(zParameterToString(z)).toBe('500/100');
  });
});

describe('Optional CSAPI query parameter types', () => {
  const dummyDate: DateTimeParameter = new Date('2025-01-01T00:00:00Z');

  test('optionalAreaParams can be constructed with all fields', () => {
    const params: optionalAreaParams = {
      parameter_name: ['temp', 'humidity'],
      z: { type: 'single', level: 1000 },
      datetime: dummyDate,
      crs: 'EPSG:4326',
      f: 'json',
    };
    expect(params.parameter_name).toContain('temp');
    expect(params.z?.type).toBe('single');
    expect(params.datetime).toBe(dummyDate);
    expect(params.crs).toBe('EPSG:4326');
    expect(params.f).toBe('json');
  });

  test('optionalLocationParams can be constructed with locationId', () => {
    const params: optionalLocationParams = {
      locationId: 'LOC123',
    };
    expect(params.locationId).toBe('LOC123');
  });

  test('optionalCubeParams allows z and datetime', () => {
    const params: optionalCubeParams = {
      z: { type: 'interval', minLevel: 0, maxLevel: 500 },
      datetime: dummyDate,
    };
    expect(params.z?.type).toBe('interval');
    expect(params.datetime).toBe(dummyDate);
  });

  test('optionalTrajectoryParams can have crs and f', () => {
    const params: optionalTrajectoryParams = {
      crs: 'EPSG:4326',
      f: 'csv',
    };
    expect(params.crs).toBe('EPSG:4326');
    expect(params.f).toBe('csv');
  });

  test('optionalCorridorParams allows resolution fields', () => {
    const params: optionalCorridorParams = {
      resolution_x: '10m',
      resolution_y: '10m',
      resolution_z: '1m',
    };
    expect(params.resolution_x).toBe('10m');
    expect(params.resolution_y).toBe('10m');
    expect(params.resolution_z).toBe('1m');
  });

  test('optionalPositionParams allows z and datetime', () => {
    const params: optionalPositionParams = {
      z: { type: 'list', levels: [100, 200] },
      datetime: dummyDate,
    };
    expect(params.z?.type).toBe('list');
    expect(params.datetime).toBe(dummyDate);
  });

  test('optionalRadiusParams allows parameter_name array', () => {
    const params: optionalRadiusParams = {
      parameter_name: ['salinity', 'temperature'],
    };
    expect(params.parameter_name).toContain('salinity');
    expect(params.parameter_name).toContain('temperature');
  });
});
