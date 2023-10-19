import LocalStorageWrapper from '~/utils/LocalStorageWrapper';

describe('LocalStorageWrapper', () => {
  it('get the value when call LocalStorageWrapper.get', () => {
    LocalStorageWrapper.set('key1', '123');
    const val1 = LocalStorageWrapper.get('key1');
    expect(val1).toBe('123');
  });
  it('get the value when call LocalStorageWrapper.getOrDefault', () => {
    LocalStorageWrapper.set('key1', '123');
    const val1 = LocalStorageWrapper.getOrDefault('key1', '456');
    expect(val1).toBe('123');
    const val2 = LocalStorageWrapper.getOrDefault('key2', '456');
    expect(val2).toBe('456');
  });
});
