import { sqleSuperRender } from '../../../../../testUtils/superRender';
import BasicInfo from '.';
import { act, fireEvent, screen, renderHook } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
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
  const customRender = (data?: Record<string, unknown>) => {
    return sqleSuperRender(
      <BasicInfo
        form={result.current[0]}
        defaultData={workflowTemplateData}
        nextStep={nextStepMock}
        updateBaseInfo={updateMock}
        totalStep={1}
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

    fireEvent.mouseDown(getBySelector('.ant-select-selection-search-input'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(updateMock).toHaveBeenCalledWith(
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal
    );
    expect(screen.getAllByText('普通(Normal)')?.[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('下一步'));
    expect(updateMock).toHaveBeenCalledWith(
      WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.normal
    );
    await act(async () => jest.advanceTimersByTime(300));
    expect(nextStepMock).toHaveBeenCalled();
  });

  it('render basic info without default data', async () => {
    const { baseElement } = customRender({ defaultData: undefined });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('告警(Warning)')).toBeInTheDocument();
  });

  it('should hide AllowSubmitWhenLessAuditLevel when workflowType is data_export', async () => {
    const { baseElement } = customRender({ workflowType: 'data_export' });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('基本信息')).toBeInTheDocument();
    expect(
      screen.queryByText('允许创建工单的最高审核等级')
    ).not.toBeInTheDocument();
    expect(
      queryBySelector('.ant-select-selection-search-input')
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(nextStepMock).toHaveBeenCalled();
  });
});
