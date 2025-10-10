import { CSAPIParameter } from './model';

test('CSAPIParameter structure is valid', () => {
  const param: CSAPIParameter = {
    id: 'Elevation',
    name: 'Elevation',
    observedProperty: { label: { id: 'Elevation', en: 'Elevation' } },
    unit: { label: { en: 'Elevation' }, symbol: { value: 'ft', type: 'http://www.opengis.net/def/uom/UCUM/' } }
  };
  expect(param.id).toBe('Elevation');
});
