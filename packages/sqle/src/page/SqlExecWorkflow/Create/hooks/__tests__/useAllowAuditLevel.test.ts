import { useAllowAuditLevel } from '../useAllowAuditLevel';
import { act, cleanup, renderHook } from '@testing-library/react';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import execWorkflow from '../../../../../testUtils/mockApi/execWorkflow';

describe('sqle/useAllowAuditLevel', () => {
  const customRender = () => {
    return renderHook(() => useAllowAuditLevel());
  };

  let requestGetWorkflowTemplate: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    requestGetWorkflowTemplate = execWorkflow.getWorkflowTemplate();
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

    expect(result.current.disabledOperatorWorkflowBtnTips).toBe('');
    await act(async () => {
      result.current.setDisabledOperatorWorkflowBtnTips('text');
    });
    expect(result.current.disabledOperatorWorkflowBtnTips).toBe('text');

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
    expect(requestGetWorkflowTemplate).toHaveBeenCalled;
    expect(resetBtnDisabledFn).toHaveBeenCalled();
    expect(result.current.disabledOperatorWorkflowBtnTips).toBe('');
  });
});
