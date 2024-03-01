import { useNavigate } from 'react-router-dom';
import { cleanup, act } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
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
    const { result } = renderHooksWithRedux(useBackToListPage, {});
    await act(async () => {
      result.current.onGoToGlobalRuleTemplateList();
      await jest.advanceTimersByTime(1000);
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('come back to project rule template list', async () => {
    const { result } = renderHooksWithRedux(useBackToListPage, {});
    await act(async () => {
      result.current.onGotoRuleTemplateList();
      await jest.advanceTimersByTime(1000);
    });
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });
});
