import { formatParamsBySeparator, fuzzySearchAndSortByWeight } from '../Tool';

describe('test utils/Tool', () => {
  it('test formatParamsBySeparator', () => {
    expect(formatParamsBySeparator(NaN)).toBe('NaN');

    expect(formatParamsBySeparator(0)).toBe('0');
    expect(formatParamsBySeparator(33)).toBe('33');
    expect(formatParamsBySeparator(333)).toBe('333');
    expect(formatParamsBySeparator(333.22)).toBe('333.22');
    expect(formatParamsBySeparator(3334.22)).toBe('3,334.22');
    expect(formatParamsBySeparator(3332334.224343)).toBe('3,332,334.224343');

    expect(formatParamsBySeparator('0')).toBe('0');
    expect(formatParamsBySeparator('33')).toBe('33');
    expect(formatParamsBySeparator('333')).toBe('333');
    expect(formatParamsBySeparator('333.22')).toBe('333.22');
    expect(formatParamsBySeparator('3334.228')).toBe('3,334.228');
    expect(formatParamsBySeparator('3332334.224343')).toBe('3,332,334.224343');
  });

  it('test fuzzySearchAndSortByWeight', () => {
    expect(fuzzySearchAndSortByWeight('', [], '')).toEqual([]);
    expect(fuzzySearchAndSortByWeight('', [{ foo: 'bar' }], 'foo')).toEqual([
      { foo: 'bar' }
    ]);

    const data = [
      { a: 'bar' },
      { a: 'foo' },
      { a: 'test-1' },
      { a: 'tes' },
      { a: 'test1' }
    ];
    expect(fuzzySearchAndSortByWeight('b', data, 'a')).toEqual([{ a: 'bar' }]);
    expect(fuzzySearchAndSortByWeight('te', data, 'a')).toEqual([
      { a: 'tes' },
      { a: 'test1' },
      { a: 'test-1' }
    ]);
    expect(fuzzySearchAndSortByWeight('tes', data, 'a')).toEqual([
      { a: 'tes' },
      { a: 'test1' },
      { a: 'test-1' }
    ]);
    expect(fuzzySearchAndSortByWeight('test', data, 'a')).toEqual([
      { a: 'test1' },
      { a: 'test-1' }
    ]);
    expect(fuzzySearchAndSortByWeight('test', data, 'a1' as any)).toEqual([]);
  });
});
