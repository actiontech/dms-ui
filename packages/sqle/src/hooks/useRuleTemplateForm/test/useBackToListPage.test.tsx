import { useNavigate } from 'react-router-dom';
import { cleanup, act, renderHook } from '@testing-library/react';
import useBackToListPage from '../useBackToListPage';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/hooks/useRuleTemplateForm/useBackToListPage', () => {
  const navigateSpy = jest.fn();
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('come back to global rule template list', async () => {
    const { result } = renderHook(() => useBackToListPage());
    await act(async () => {
      result.current.onGoToGlobalRuleTemplateList();
      await jest.advanceTimersByTime(1000);
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith('/sqle/rule-manager');
  });

  it('come back to project rule template list', async () => {
    const { result } = renderHook(() => useBackToListPage('600300'));
    await act(async () => {
      result.current.onGotoRuleTemplateList();
      await jest.advanceTimersByTime(1000);
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/600300/rule/template`
    );
  });
});
