import { sqleSuperRender } from '../../../../../testUtils/superRender';
import BasicInfo from '.';
import { act, fireEvent, screen, renderHook } from '@testing-library/react';
import { workflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { Form } from 'antd';

describe('page/WorkflowTemplate/BasicInfo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const nextStepMock = jest.fn();
  const updateMock = jest.fn();

  const { result } = renderHook(() => Form.useForm());
  const customRender = (data?: { [key: string]: undefined }) => {
    return sqleSuperRender(
      <BasicInfo
        form={result.current[0]}
        defaultData={workflowTemplateData}
        nextStep={nextStepMock}
        updateBaseInfo={updateMock}
        totalStep={1}
        isCreateMode
        {...data}
      />
    );
  };
  it('render basic info', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('基本信息')).toBeInTheDocument();
    expect(screen.getByText('告警(Warning)')).toBeInTheDocument();
    expect(screen.getByText('下一步')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(updateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        workflowTemplateName: workflowTemplateData.workflow_template_name,
        allowSubmitWhenLessAuditLevel:
          WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn
      })
    );
    expect(nextStepMock).toHaveBeenCalled();
  });

  it('render basic info without default data', async () => {
    const { baseElement } = customRender({ defaultData: undefined });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('告警(Warning)')).toBeInTheDocument();
  });
});
