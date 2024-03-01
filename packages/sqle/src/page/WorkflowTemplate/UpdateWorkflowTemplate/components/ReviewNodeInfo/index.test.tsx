import { superRender } from '../../../../../testUtils/customRender';
import ReviewAndExecNodeInfo from '.';
import { Form, Select } from 'antd';
import { NodeTypeEnum } from './index.type';
import { workflowTemplateData } from '../../../../../testUtils/mockApi/workflowTemplate/data';
import { act, fireEvent, screen, renderHook } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { userTipListData } from '../../../../../testUtils/mockApi/user/data';

describe('page/WorkflowTemplate/ReviewNodeInfo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const prevMock = jest.fn();
  const nextMock = jest.fn();
  const updateMock = jest.fn();
  const generateMock = () => {
    return userTipListData.map((user) => {
      return (
        <Select.Option key={user.user_id} value={user.user_id ?? ''}>
          {user.user_name}
        </Select.Option>
      );
    });
  };

  const { result } = renderHook(() => Form.useForm());
  const customRender = (data?: {
    [key: string]: NodeTypeEnum | IWorkFlowStepTemplateResV1;
  }) => {
    return superRender(
      <ReviewAndExecNodeInfo
        form={result.current[0]}
        type={NodeTypeEnum.review}
        defaultData={workflowTemplateData.workflow_step_template_list[0]}
        prevStep={prevMock}
        nextStep={nextMock}
        currentStep={1}
        totalStep={3}
        updateReviewAndExecNodeInfo={updateMock}
        generateUsernameSelectOption={generateMock}
        getUsernameListLoading={false}
        {...(data ?? {})}
      />
    );
  };

  it('render normal review node info', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('审核节点')).toBeInTheDocument();
    expect(
      screen.getByText('匹配拥有数据源审核权限的成员')
    ).toBeInTheDocument();
    expect(screen.getByText('审核人')).toBeInTheDocument();
    expect(getBySelector('.ant-select')).toHaveClass('ant-select-disabled');
    expect(getBySelector('#approved_by_authorized')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector('#approved_by_authorized'));
    });
    expect(getBySelector('.ant-select')).not.toHaveClass('ant-select-disabled');
  });

  it('render review node with default assignee user', async () => {
    const { baseElement } = customRender({
      defaultData: workflowTemplateData.workflow_step_template_list[1]
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('上一步')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('上一步'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(prevMock).toHaveBeenCalled();
  });

  it('render review node and update review node info', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('#approved_by_authorized'));
    expect(updateMock).toHaveBeenCalledWith({
      ...workflowTemplateData.workflow_step_template_list[0],
      assignee_user_id_list: [],
      approved_by_authorized: false
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search-input'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(updateMock).toHaveBeenCalledWith({
      ...workflowTemplateData.workflow_step_template_list[0],
      assignee_user_id_list: ['1739544663515205632']
    });
    expect(screen.getAllByText('test')?.[0]).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    const desc = 'this is desc';
    fireEvent.change(getBySelector('#desc'), {
      target: { value: desc }
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.click(screen.getByText('下一步'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(updateMock).toHaveBeenCalledWith({
      ...workflowTemplateData.workflow_step_template_list[0],
      desc
    });
  });

  it('render normal exec node info', async () => {
    const { baseElement } = customRender({
      type: NodeTypeEnum.exec,
      defaultData: workflowTemplateData.workflow_step_template_list[2]
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('执行上线')).toBeInTheDocument();
    expect(
      screen.getByText('匹配拥有数据源上线权限的成员')
    ).toBeInTheDocument();
    expect(screen.getByText('执行人')).toBeInTheDocument();
  });
});
