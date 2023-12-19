import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { renderHook } from '@testing-library/react-hooks';
import useThemeStyleData from '.';

describe('test base/hooks/useThemeStyleData', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });
  it('should match snapshot', () => {
    const { result } = renderHook(() => useThemeStyleData());

    expect(result.current.baseTheme).toMatchSnapshot();
    expect(result.current.sharedTheme).toMatchSnapshot();
    expect(result.current.sqleTheme).toMatchSnapshot();
  });
});
