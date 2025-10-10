import { extractParameters } from './helpers';

test('extractParameters returns correct array', () => {
  const input = {
    Elevation: {
      id: 'Elevation',
      name: 'Elevation',
      observedProperty: { label: { id: 'Elevation', en: 'Elevation' } },
      unit: { label: { en: 'Elevation' }, symbol: { value: 'ft', type: 'http://www.opengis.net/def/uom/UCUM/' } }
    }
  };
  const result = extractParameters(input);
  expect(result.length).toBe(1);
  expect(result[0].id).toBe('Elevation');
});
