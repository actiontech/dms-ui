import { renderHook, act } from '@testing-library/react';
import useValidatorNumber from '../useValidatorNumber';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';

describe('useValidatorNumber', () => {
  it('should execute integerValidator', async () => {
    const { result } = renderHook(() => useValidatorNumber());
    renderWithReduxAndTheme(<div>{result.current.messageContextHolder}</div>);
    await act(async () => {
      expect(result.current.integerValidator('test')).toBeFalsy();
      expect(result.current.integerValidator('123aaa')).toBeFalsy();
      expect(result.current.integerValidator('123')).toBeTruthy();
    });
  });
});
