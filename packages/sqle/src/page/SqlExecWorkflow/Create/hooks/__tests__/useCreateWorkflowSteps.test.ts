import { act, renderHook } from '@testing-library/react';
import useCreateWorkflowSteps from '../useCreateWorkflowSteps';

describe('test useCreateWorkflowSteps', () => {
  it('should correctly identify being at the form step', () => {
    const { result } = renderHook(() => useCreateWorkflowSteps());
    expect(result.current.isAtFormStep).toBe(true);
  });

  it('should update currentStep to 1 and identify being at the audit result step', () => {
    const { result } = renderHook(() => useCreateWorkflowSteps());
    act(() => {
      result.current.goToAuditResultStep();
    });
    expect(result.current.isAtAuditResultStep).toBe(true);
  });

  it('should update currentStep to 2 and identify being at the create result step', () => {
    const { result } = renderHook(() => useCreateWorkflowSteps());
    act(() => {
      result.current.goToCreateResultStep();
    });
    expect(result.current.isAtCreateResultStep).toBe(true);
  });

  it('should be able to navigate back to the form step', () => {
    const { result } = renderHook(() => useCreateWorkflowSteps());
    act(() => {
      result.current.goToFormStep();
      result.current.goToAuditResultStep();
      result.current.goToCreateResultStep();
    });
    expect(result.current.isAtCreateResultStep).toBe(true);
  });
});
