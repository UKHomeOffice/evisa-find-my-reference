const { getLabel, formatDate } = require('../../utils');

describe('Utilities \'getLabel\'', () => {
  test('returns undefined when an unexpected fieldKey parameter is passed', () => {
    expect(getLabel('cheese', 'very-satisfied')).toBe(undefined);
    expect(getLabel(null, 'very-satisfied')).toBe(undefined);
    expect(getLabel(undefined, 'very-satisfied')).toBe(undefined);
  });

  test('returns undefined when an unexpected fieldValue parameter is passed', () => {
    expect(getLabel('satisfaction', 'very-cheese')).toBe(undefined);
    expect(getLabel('satisfaction', null)).toBe(undefined);
    expect(getLabel('satisfaction', undefined)).toBe(undefined);
  });
});

describe('Utilities \'formatDate\'', () => {
  test('reformats a string type date from YYYY-MM-DD to DD MM YYYY', () => {
    expect(formatDate('1987-08-14')).toBe('14 08 1987');
  });

  test('reformats a string type date from MM/DD/YYYY to DD MM YYYY', () => {
    expect(formatDate('08/14/1987')).toBe('14 08 1987');
  });

  test('throws an error when the parameter cannot be parsed as a date', () => {
    expect(() => formatDate('hello')).toThrow();
  });
});
