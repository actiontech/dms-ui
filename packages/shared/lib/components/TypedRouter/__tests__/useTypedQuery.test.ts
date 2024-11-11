import { renderHook } from '@testing-library/react-hooks';
import { useSearchParams } from 'react-router-dom';
import { useTypedQuery } from '..';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn()
}));

describe('useTypedQuery', () => {
  const createMockSearchParams = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value);
    });
    return searchParams;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when searchParams is null', () => {
    (useSearchParams as jest.Mock).mockReturnValue([null]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/test',
      query: 'page&sort'
    };

    expect(result.current(pathConfig)).toBeNull();
  });

  it('should return null when query is not defined in path config', () => {
    const mockSearchParams = createMockSearchParams({ page: '1' });
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/test'
    };

    expect(result.current(pathConfig)).toBeNull();
  });

  it('should extract single query parameter correctly', () => {
    const mockSearchParams = createMockSearchParams({ page: '1' });
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/test',
      query: 'page'
    } as const;

    const searchParams = result.current(pathConfig);
    expect(searchParams?.page).toBe('1');
  });

  it('should extract multiple query parameters correctly', () => {
    const mockSearchParams = createMockSearchParams({
      page: '1',
      sort: 'desc',
      filter: 'active'
    });
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/test',
      query: 'page&sort&filter'
    } as const;

    const searchParams = result.current(pathConfig);

    expect(searchParams).toEqual({
      page: '1',
      sort: 'desc',
      filter: 'active'
    });
  });

  it('should handle missing query parameters with null', () => {
    const mockSearchParams = createMockSearchParams({
      page: '1'
    });
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/test',
      query: 'page&sort&filter'
    } as const;
    const searchParams = result.current(pathConfig);
    expect(searchParams?.page).toBe('1');
    expect(searchParams?.sort).toBeNull();
    expect(searchParams?.filter).toBeNull();
  });

  it('should handle empty query string', () => {
    const mockSearchParams = createMockSearchParams({});
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/test',
      query: ''
    } as const;

    expect(result.current(pathConfig)).toBeNull();
  });

  it('should handle complex path config', () => {
    const mockSearchParams = createMockSearchParams({
      view: 'grid',
      sort: 'name',
      order: 'asc',
      page: '1'
    });
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      prefix: '/app',
      path: '/items/:category',
      query: 'view&sort&order&page'
    } as const;
    const searchParams = result.current(pathConfig);
    expect(searchParams?.view).toBe('grid');
    expect(searchParams?.sort).toBe('name');
    expect(searchParams?.order).toBe('asc');
    expect(searchParams?.page).toBe('1');
  });

  it('should memoize the extractQueries function', () => {
    const mockSearchParams = createMockSearchParams({ page: '1' });
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result, rerender } = renderHook(() => useTypedQuery());
    const firstInstance = result.current;

    rerender();
    expect(result.current).toBe(firstInstance);
  });

  it('should update when searchParams changes', () => {
    // Initial render
    const initialSearchParams = createMockSearchParams({ page: '1' });
    (useSearchParams as jest.Mock).mockReturnValue([initialSearchParams]);

    const { result, rerender } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/test',
      query: 'page'
    } as const;

    expect(result.current(pathConfig)).toEqual({ page: '1' });

    // Update searchParams
    const updatedSearchParams = createMockSearchParams({ page: '2' });
    (useSearchParams as jest.Mock).mockReturnValue([updatedSearchParams]);

    rerender();
    expect(result.current(pathConfig)).toEqual({ page: '2' });
  });

  it('should handle special characters in query values', () => {
    const mockSearchParams = createMockSearchParams({
      search: 'test space&special',
      filter: 'category=books'
    });
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/search',
      query: 'search&filter'
    } as const;

    expect(result.current(pathConfig)).toEqual({
      search: 'test space&special',
      filter: 'category=books'
    });
  });

  it('should handle when query parameter appears multiple times', () => {
    const searchParams = new URLSearchParams();
    searchParams.append('tag', 'react');
    searchParams.append('tag', 'typescript');

    (useSearchParams as jest.Mock).mockReturnValue([searchParams]);

    const { result } = renderHook(() => useTypedQuery());
    const pathConfig = {
      path: '/posts',
      query: 'tag'
    } as const;

    // Should return the first value as per URLSearchParams.get() behavior
    expect(result.current(pathConfig)).toEqual({
      tag: 'react'
    });
  });
});
