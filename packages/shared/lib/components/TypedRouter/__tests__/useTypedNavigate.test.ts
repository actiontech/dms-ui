import { renderHook } from '@testing-library/react-hooks';
import { useNavigate } from 'react-router-dom';
import { useTypedNavigate } from '../index';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('useTypedNavigate', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  it('should handle numeric navigation correctly', () => {
    const { result } = renderHook(() => useTypedNavigate());

    result.current(-1);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('should handle simple string path navigation', () => {
    const { result } = renderHook(() => useTypedNavigate());

    result.current('/simple-path');
    expect(mockNavigate).toHaveBeenCalledWith('/simple-path');
  });

  it('should handle object path with params', () => {
    const { result } = renderHook(() => useTypedNavigate());
    const pathConfig = {
      path: '/user/:id/profile/:tab'
    } as const;

    result.current(pathConfig, {
      params: { id: '123', tab: 'settings' }
    });

    expect(mockNavigate).toHaveBeenCalledWith('/user/123/profile/settings');
  });

  it('should handle object path with queries', () => {
    const { result } = renderHook(() => useTypedNavigate());
    const pathConfig = {
      path: '/search',
      query: 'q&page'
    } as const;

    result.current(pathConfig, {
      queries: { q: 'test', page: '1' }
    });

    expect(mockNavigate).toHaveBeenCalledWith('/search?q=test&page=1');
  });

  it('should handle object path with both params and queries', () => {
    const { result } = renderHook(() => useTypedNavigate());
    const pathConfig = {
      prefix: '/app',
      path: 'user/:id',
      query: 'tab&view'
    } as const;

    result.current(pathConfig, {
      params: { id: '123' },
      queries: { tab: 'profile', view: 'detail' }
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/app/user/123?tab=profile&view=detail'
    );
  });

  it('should handle object path without params and queries', () => {
    const { result } = renderHook(() => useTypedNavigate());
    const pathConfig = {
      prefix: '/app',
      path: 'user',
      query: 'tab&view'
    } as const;

    result.current(pathConfig);

    expect(mockNavigate).toHaveBeenCalledWith('/app/user');
  });

  it('should handle object path without params and queries with options', () => {
    const { result } = renderHook(() => useTypedNavigate());
    const pathConfig = {
      prefix: '/app',
      path: 'user',
      query: 'tab&view'
    } as const;

    result.current(pathConfig, { replace: true });

    expect(mockNavigate).toHaveBeenCalledWith('/app/user', { replace: true });
  });

  it('should pass through navigation options', () => {
    const { result } = renderHook(() => useTypedNavigate());
    const pathConfig = {
      path: '/user/:id'
    } as const;

    result.current(pathConfig, {
      params: { id: '123' },
      replace: true,
      state: { from: 'home' }
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      '/user/123',
      expect.objectContaining({
        replace: true,
        state: { from: 'home' }
      })
    );
  });
});
