import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import useRuleExceptionActions from '../useRuleExceptionActions';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { storeFactory } from '../../../testUtils/mockRedux';

const renderUseRuleExceptionActions = () => {
  const store = storeFactory();
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <MemoryRouter>
      <Provider store={store}>{children}</Provider>
    </MemoryRouter>
  );
  return {
    store,
    ...renderHook(() => useRuleExceptionActions(), { wrapper })
  };
};

describe('sqle/components/RuleException/useRuleExceptionActions', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser({
      isAdmin: true,
      isProjectManager: jest.fn().mockReturnValue(true)
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('reports canWrite for admin or project manager', () => {
    const { result } = renderUseRuleExceptionActions();
    expect(result.current.canWrite).toBe(true);
  });

  it('reports canWrite false when user lacks write permission', () => {
    mockUseCurrentUser({
      ...mockCurrentUserReturn,
      isAdmin: false,
      isProjectManager: jest.fn().mockReturnValue(false)
    });
    const { result } = renderUseRuleExceptionActions();
    expect(result.current.canWrite).toBe(false);
  });

  it('opens detail drawer by audit whitelist id', () => {
    const { result, store } = renderUseRuleExceptionActions();

    act(() => {
      result.current.openExceptionDetail(42);
    });

    expect(store.getState().whitelist.detailDrawerOpen).toBe(true);
    expect(store.getState().whitelist.detailDrawerWhitelistId).toBe(42);
  });

  it('ignores empty audit whitelist id', () => {
    const { result, store } = renderUseRuleExceptionActions();

    act(() => {
      result.current.openExceptionDetail(undefined);
    });

    expect(store.getState().whitelist.detailDrawerOpen).toBe(false);
  });
});
