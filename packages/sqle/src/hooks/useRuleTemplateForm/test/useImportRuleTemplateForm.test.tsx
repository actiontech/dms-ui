import { cleanup, act } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useImportRuleTemplateForm from '../useImportRuleTemplateForm';

describe('sqle/hooks/useRuleTemplateForm/useImportRuleTemplateForm', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('init state', async () => {
    const { result } = renderHooksWithRedux(useImportRuleTemplateForm, {});
    await act(async () => jest.advanceTimersByTime(3000));
    expect(result.current.activeRule).toEqual([]);
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(result.current.allRules).toEqual(undefined);
    expect(result.current.dbType).toEqual(undefined);
    expect(result.current.step).toEqual(0);
    expect(result.current.submitSuccessStatus).toEqual(false);
    expect(result.current.createLoading).toEqual(false);
  });

  it('loading status control', async () => {
    const { result } = renderHooksWithRedux(useImportRuleTemplateForm, {});

    await act(async () => {
      result.current.startCreate();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.createLoading).toEqual(true);
    await act(async () => {
      result.current.finishCreate();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.createLoading).toEqual(false);
  });
});
