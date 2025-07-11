import { cleanup, act } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import useCreateRuleTemplateForm from '../useCreateRuleTemplateForm';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';

describe('sqle/hooks/useRuleTemplateForm/useCreateRuleTemplateForm', () => {
  let getRulesSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getRulesSpy = rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('init state', async () => {
    const { result } = superRenderHook(useCreateRuleTemplateForm);
    expect(result.current.getAllRulesLoading).toEqual(false);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getRulesSpy).toHaveBeenCalledTimes(0);
    expect(result.current.activeRule).toEqual([]);
    expect(result.current.getAllRulesLoading).toEqual(false);
    expect(result.current.dbType).toEqual(undefined);
    expect(result.current.step).toEqual(0);
    expect(result.current.submitSuccessStatus).toEqual(false);
    expect(result.current.createLoading).toEqual(false);
  });

  it('loading status control', async () => {
    const { result } = superRenderHook(useCreateRuleTemplateForm);

    await act(async () => {
      result.current.startSubmit();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.createLoading).toEqual(true);
    await act(async () => {
      result.current.finishSubmit();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.createLoading).toEqual(false);
  });
});
