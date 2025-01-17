import { renderHooksWithRedux } from '../../testUtil/customRender';
import { act } from '@testing-library/react';
import { SupportTheme } from '../../enum';
import useChangeTheme from '.';
import { mockUseCurrentUser } from '../../testUtil/mockHook/mockUseCurrentUser';

describe('useChangeTheme', () => {
  const customRender = () => {
    return renderHooksWithRedux(() => useChangeTheme(), {
      user: {
        theme: SupportTheme.LIGHT,
        managementPermissions: []
      }
    });
  };

  it('render set default theme is light', () => {
    const { result } = customRender();
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
  });

  it('render dispatch updateTheme', async () => {
    const { result } = customRender();
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');

    act(() => {
      result.current.changeTheme(SupportTheme.DARK);
    });
    expect(result.current.currentTheme).toBe(SupportTheme.DARK);
    expect(result.current.currentEditorTheme).toBe('vs-dark');

    act(() => {
      result.current.changeTheme(SupportTheme.LIGHT);
    });
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
  });

  it('set dark theme for default theme', async () => {
    mockUseCurrentUser({ theme: SupportTheme.DARK });
    const { result } = customRender();
    act(() => {
      result.current.changeTheme(SupportTheme.DARK);
    });
    expect(result.current.currentTheme).toBe(SupportTheme.DARK);
    expect(result.current.currentEditorTheme).toBe('vs-dark');
  });
});
