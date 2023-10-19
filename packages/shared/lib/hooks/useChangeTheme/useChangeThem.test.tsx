import { SupportTheme } from '../../enum';
import useChangeTheme from './useChangeTheme';
import { renderHook } from '@testing-library/react-hooks';

describe('useChangeTheme', () => {
  const mockUpdateTheme = jest.fn();
  afterEach(() => {
    document.querySelector('#light-theme')?.remove();
    document.querySelector('#dark-theme')?.remove();
  });

  test('should render light theme when theme is Light', () => {
    const { result } = renderHook(() =>
      useChangeTheme({
        theme: SupportTheme.LIGHT,
        updateTheme: mockUpdateTheme
      })
    );
    expect(result.current.changeLoading).toBe(false);
    expect(result.current.currentTheme).toBe(SupportTheme.LIGHT);
    expect(result.current.currentEditorTheme).toBe('vs');
    expect(mockUpdateTheme).not.toBeCalled();
  });

  test('should render dark theme when theme is Dark', () => {
    const { result } = renderHook(() =>
      useChangeTheme({
        theme: SupportTheme.DARK,
        updateTheme: mockUpdateTheme
      })
    );
    expect(result.current.changeLoading).toBe(true);
    expect(result.current.currentTheme).toBe(SupportTheme.DARK);
    expect(result.current.currentEditorTheme).toBe('vs-dark');
    expect(mockUpdateTheme).toBeCalled();
  });
});
