import { act, renderHook } from '@testing-library/react-hooks';
import { mockUseAuditPlanTypes } from '../../../../../../testUtils/mockRequest';
import useSourceTips from '../useSourceTips';

describe('test useSourceTips', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });
  it('should math snapshot with ', async () => {
    const requestSpy = mockUseAuditPlanTypes();

    const { result } = renderHook(() => useSourceTips());

    expect(requestSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.generateSourceSelectOptions).toMatchSnapshot();
  });
});
