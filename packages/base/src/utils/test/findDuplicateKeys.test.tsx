import { findDuplicateKeys } from '../findDuplicateKeys';

describe('utils/findDuplicateKeys', () => {
  it('render when obj has same key', () => {
    const objA = {
      a: '1'
    };
    const objB = {
      a: '2',
      b: '1'
    };
    const result = findDuplicateKeys([objA, objB]);
    expect(result.length).toBe(1);
    expect(result).toEqual(['a']);
  });

  it('render more obj when obj has same key', () => {
    const objA = {
      c: '1',
      e: {
        a: '2'
      }
    };
    const objB = {
      a: '2',
      b: '1'
    };
    const result = findDuplicateKeys([objA, objB]);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });

  it('render when obj no same key', () => {
    const objA = {
      a: '1'
    };
    const objB = {
      b: '2'
    };
    const result = findDuplicateKeys([objA, objB]);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});
