import { act, renderHook } from '@testing-library/react';
import useSqlRewrittenDrawerState from '../../hooks/useSqlRewrittenDrawerState';

describe('useSqlRewrittenDrawerState', () => {
  it('should initialize with sqlRewrittenOpen as false', () => {
    const { result } = renderHook(() => useSqlRewrittenDrawerState());
    expect(result.current.sqlRewrittenOpen).toBe(false);
  });

  it('should open the drawer when handleOpenSqlRewrittenDrawer is called', () => {
    const { result } = renderHook(() => useSqlRewrittenDrawerState());
    act(() => {
      result.current.handleOpenSqlRewrittenDrawer();
    });
    expect(result.current.sqlRewrittenOpen).toBe(true);
  });

  it('should close the drawer and reset originSqlInfo when handleCloseSqlRewrittenDrawer is called', () => {
    const { result } = renderHook(() => useSqlRewrittenDrawerState());

    act(() => {
      result.current.handleOpenSqlRewrittenDrawer();
    });

    act(() => {
      result.current.handleChangeOriginInfo({
        sql: 'select * from user',
        number: 1
      });
    });

    act(() => {
      result.current.handleCloseSqlRewrittenDrawer();
    });

    expect(result.current.sqlRewrittenOpen).toBe(false);
    expect(result.current.originSqlInfo).toBeUndefined();
  });

  it('should set originSqlInfo correctly when setOriginInfo is called', () => {
    const { result } = renderHook(() => useSqlRewrittenDrawerState());
    const mockOriginSqlInfo = {
      sql: 'select * from user',
      number: 1
    };

    act(() => {
      result.current.handleChangeOriginInfo(mockOriginSqlInfo);
    });

    expect(result.current.originSqlInfo).toEqual(mockOriginSqlInfo);
  });
});
