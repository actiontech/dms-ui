import useChangeTheme from '.';
import { renderHooksWithRedux } from '../../testUtils/customRender';
import { SupportTheme, ThemeData } from '../../theme';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('@actiontech/shared/lib/global/useCurrentUser', () => jest.fn());

describe('useChangeTheme', () => {
  beforeEach(() => {
    (useCurrentUser as jest.Mock).mockImplementation(
      () => mockCurrentUserReturn
    );
  });
  afterEach(() => {
    document.querySelector('#light-theme')?.remove();
    document.querySelector('#dark-theme')?.remove();
  });

  test('should return default theme when redux in empty', () => {
    const { result } = renderHooksWithRedux(() => useChangeTheme());
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
    expect(result.current.currentThemeData).toEqual(
      ThemeData[SupportTheme.LIGHT]
    );
  });
});
