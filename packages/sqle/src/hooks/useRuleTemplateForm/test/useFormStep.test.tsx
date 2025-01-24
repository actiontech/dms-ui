import { renderHook, act } from '@testing-library/react-hooks';
import useFormStep from '../useFormStep';

describe('useFormStep', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFormStep());

    expect(result.current.step).toBe(0);
    expect(result.current.submitSuccessStatus).toBe(false);
    expect(result.current.baseInfoFormSubmitLoading).toBe(false);
    expect(result.current.dbType).toBeUndefined();
    expect(result.current.ruleVersion).toBeUndefined();
  });

  it('should update step when nextStep is called', () => {
    const { result } = renderHook(() => useFormStep());

    act(() => {
      result.current.nextStep();
    });

    expect(result.current.step).toBe(1);
  });

  it('should update step when prevStep is called', () => {
    const { result } = renderHook(() => useFormStep());

    act(() => {
      result.current.nextStep();
    });

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.step).toBe(0);
  });

  it('should not allow step to go below 0', () => {
    const { result } = renderHook(() => useFormStep());

    act(() => {
      result.current.prevStep();
    });

    expect(result.current.step).toBe(0);
  });

  it('should set submitSuccessStatus to true when step is SUCCESS_STEP_NUM', () => {
    const { result } = renderHook(() => useFormStep());

    act(() => {
      result.current.setStep(2);
    });

    expect(result.current.submitSuccessStatus).toBe(true);
  });

  it('should set submitSuccessStatus to false when step is not SUCCESS_STEP_NUM', () => {
    const { result } = renderHook(() => useFormStep());

    act(() => {
      result.current.setStep(1);
    });

    expect(result.current.submitSuccessStatus).toBe(false);
  });

  it('should update baseInfoFormSubmitLoading when setBaseInfoFormSubmitLoading is called', () => {
    const { result } = renderHook(() => useFormStep());

    act(() => {
      result.current.setBaseInfoFormSubmitLoading(true);
    });

    expect(result.current.baseInfoFormSubmitLoading).toBe(true);

    act(() => {
      result.current.setBaseInfoFormSubmitLoading(false);
    });

    expect(result.current.baseInfoFormSubmitLoading).toBe(false);
  });
});
