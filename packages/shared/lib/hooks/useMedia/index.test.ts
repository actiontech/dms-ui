import { renderHook } from '@testing-library/react';
import useMedia from '.';
import * as MUI from '@mui/material';

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
  useTheme: jest.fn()
}));

describe('useMedia', () => {
  const mockTheme = {
    breakpoints: {
      down: jest.fn()
    }
  };

  beforeEach(() => {
    (MUI.useTheme as jest.Mock).mockReturnValue(mockTheme);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return isMobile as false and isSmallMobile as false when screen is large', () => {
    mockTheme.breakpoints.down.mockReturnValue('(max-width: 768px)');
    (MUI.useMediaQuery as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useMedia());

    expect(result.current.isMobile).toBe(false);
    expect(result.current.isSmallMobile).toBe(false);
    expect(mockTheme.breakpoints.down).toHaveBeenCalledWith('md');
    expect(mockTheme.breakpoints.down).toHaveBeenCalledWith('sm');
  });

  it('should return isMobile as true when screen width is less than md breakpoint', () => {
    mockTheme.breakpoints.down.mockImplementation((breakpoint) => {
      if (breakpoint === 'md') return '(max-width: 768px)';
      if (breakpoint === 'sm') return '(max-width: 480px)';
      return '';
    });

    (MUI.useMediaQuery as jest.Mock).mockImplementation((query) => {
      if (query === '(max-width: 768px)') return true;
      if (query === '(max-width: 480px)') return false;
      return false;
    });

    const { result } = renderHook(() => useMedia());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isSmallMobile).toBe(false);
  });

  it('should return isSmallMobile as true when screen width is less than sm breakpoint', () => {
    mockTheme.breakpoints.down.mockImplementation((breakpoint) => {
      if (breakpoint === 'md') return '(max-width: 768px)';
      if (breakpoint === 'sm') return '(max-width: 480px)';
      return '';
    });

    (MUI.useMediaQuery as jest.Mock).mockImplementation((query) => {
      if (query === '(max-width: 768px)') return true;
      if (query === '(max-width: 480px)') return true;
      return false;
    });

    const { result } = renderHook(() => useMedia());

    expect(result.current.isMobile).toBe(true);
    expect(result.current.isSmallMobile).toBe(true);
  });

  it('should call useTheme hook', () => {
    mockTheme.breakpoints.down.mockReturnValue('(max-width: 768px)');
    (MUI.useMediaQuery as jest.Mock).mockReturnValue(false);

    renderHook(() => useMedia());

    expect(MUI.useTheme).toHaveBeenCalledTimes(1);
  });

  it('should call useMediaQuery with correct breakpoint queries', () => {
    const mdQuery = '(max-width: 768px)';
    const smQuery = '(max-width: 480px)';

    mockTheme.breakpoints.down.mockImplementation((breakpoint) => {
      if (breakpoint === 'md') return mdQuery;
      if (breakpoint === 'sm') return smQuery;
      return '';
    });

    (MUI.useMediaQuery as jest.Mock).mockReturnValue(false);

    renderHook(() => useMedia());

    expect(MUI.useMediaQuery).toHaveBeenCalledTimes(2);
    expect(MUI.useMediaQuery).toHaveBeenCalledWith(mdQuery);
    expect(MUI.useMediaQuery).toHaveBeenCalledWith(smQuery);
  });
});
