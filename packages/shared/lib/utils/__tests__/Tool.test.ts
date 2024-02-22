import { formatParamsBySeparator } from '../Tool';

describe('test utils/Tool', () => {
  it('test formatParamsBySeparator', () => {
    expect(formatParamsBySeparator(NaN)).toBe(NaN);
  });
});
