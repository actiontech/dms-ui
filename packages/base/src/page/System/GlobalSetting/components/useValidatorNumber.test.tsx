import { renderHook } from '@testing-library/react';
import useValidatorNumber from './useValidatorNumber';

describe('useValidatorNumber', () => {
  it('should execute integerValidator', async () => {
    // ignore message api error
    jest.spyOn(console, 'error').mockImplementation(() => { });

    const { result } = renderHook(() => useValidatorNumber());
    expect(result.current.integerValidator('test')).toBeFalsy();
    expect(result.current.integerValidator('123aaa')).toBeFalsy();
    expect(result.current.integerValidator('123')).toBeTruthy();
    (console.error as jest.Mock).mockRestore();
  });
});
