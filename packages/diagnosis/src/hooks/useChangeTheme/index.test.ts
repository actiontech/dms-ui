import { renderHooksWithRedux } from '../../testUtils/customRender';
import { act } from '@testing-library/react';
import useChangeTheme from '.';
import { SupportTheme } from '@actiontech/shared/lib/enum';

describe('diagnosis/useChangeTheme', () => {
  const customRender = (themeData?: SupportTheme) => {
    return renderHooksWithRedux(() => useChangeTheme(), {
      user: {
        theme: themeData ?? SupportTheme.LIGHT
      }
    });
  };

  it('render default theme by light', () => {
    const { result } = customRender();
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
  });

  it('render default theme by dark', () => {
    const { result } = customRender(SupportTheme.DARK);
    act(() => {
      result.current.changeTheme(SupportTheme.DARK);
    });
    expect(result.current.currentTheme).toBe(SupportTheme.DARK);
    expect(result.current.currentEditorTheme).toBe('vs-dark');
  });

  it('change Theme', async () => {
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
});
