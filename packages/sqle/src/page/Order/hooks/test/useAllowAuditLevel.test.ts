import { useAllowAuditLevel } from '../useAllowAuditLevel';

import { act, cleanup, renderHook } from '@testing-library/react';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import order from '../../../../testUtils/mockApi/order';

describe('sqle/order/hooks/useAllowAuditLevel', () => {
  const customRender = () => {
    return renderHook(() => useAllowAuditLevel());
  };

  let requestGetWorkflowTemplate: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetWorkflowTemplate = order.getWorkflowTemplate();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render use judgeAuditLevel fn', async () => {
    const setBtnDisabledFn = jest.fn();
    const resetBtnDisabledFn = jest.fn();
    const { result } = customRender();

    expect(result.current.disabledOperatorOrderBtnTips).toBe('');
    await act(async () => {
      result.current.setDisabledOperatorOrderBtnTips('text');
    });
    expect(result.current.disabledOperatorOrderBtnTips).toBe('text');

    await act(async () => {
      result.current.judgeAuditLevel(
        [
          {
            projectName: 'a',
            instanceName: 'instance a',
            currentAuditLevel:
              WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal
          }
        ],
        setBtnDisabledFn,
        resetBtnDisabledFn
      );
      await act(async () => jest.advanceTimersByTime(3000));
    });
    expect(requestGetWorkflowTemplate).toBeCalled;
    expect(resetBtnDisabledFn).toBeCalled();
    expect(result.current.disabledOperatorOrderBtnTips).toBe('');
  });
});
