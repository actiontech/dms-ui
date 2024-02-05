import { cleanup, act } from '@testing-library/react';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import useFormStep from '../useFormStep';

describe('sqle/hooks/useRuleTemplateForm/useFormStep', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('init state', async () => {
    const { result } = renderHooksWithRedux(useFormStep, {});
    expect(result.current.step).toEqual(0);
    expect(result.current.submitSuccessStatus).toEqual(false);
    expect(result.current.baseInfoFormSubmitLoading).toEqual(false);
  });

  it('change step state', async () => {
    const { result } = renderHooksWithRedux(useFormStep, {});
    expect(result.current.step).toEqual(0);
    await act(async () => {
      result.current.nextStep();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.step).toEqual(1);
    await act(async () => {
      result.current.prevStep();
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.step).toEqual(0);
    await act(async () => {
      result.current.setStep(2);
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.step).toEqual(2);
    expect(result.current.submitSuccessStatus).toEqual(true);
  });

  it('change loading state', async () => {
    const { result } = renderHooksWithRedux(useFormStep, {});
    expect(result.current.baseInfoFormSubmitLoading).toEqual(false);
    await act(async () => {
      result.current.setBaseInfoFormSubmitLoading(true);
      await jest.advanceTimersByTime(100);
    });
    expect(result.current.baseInfoFormSubmitLoading).toEqual(true);
  });
});
