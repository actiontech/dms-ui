import { superRender } from '../../../testUtils/customRender';
import UpdateWorkflowTemplate from '.';
import { workflowTemplateData } from '../../../testUtils/mockApi/workflowTemplate/data';
import { act, fireEvent, screen, cleanup } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import workflowTemplate from '../../../testUtils/mockApi/workflowTemplate';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useParams } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { cloneDeep } from 'lodash';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { ignoreAntdUseFormNotConnectedError } from '@actiontech/shared/lib/testUtil/common';
import user from '../../../testUtils/mockApi/user';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

describe('page/WorkflowTemplate/UpdateWorkflowTemplate', () => {
  ignoreAntdUseFormNotConnectedError();

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const customRender = () => {
    return superRender(<UpdateWorkflowTemplate />);
  };

  beforeEach(() => {
    useParamsMock.mockReturnValue({
      workflowName: workflowTemplateData.workflow_template_name
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    workflowTemplate.mockAllApi();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  it('render update workflow template and submit success', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const updateInfoRequest = workflowTemplate.updateWorkflowTemplate();
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userInfoRequest).toBeCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('返回审批流程模版')).toBeInTheDocument();
    expect(getBySelector('a')).toBeInTheDocument();
    expect(getBySelector('a')).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/progress`
    );
    expect(screen.getByText('重 置')).toBeInTheDocument();
    expect(screen.getByText('保 存')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText('保 存'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(updateInfoRequest).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_step_template_list:
        workflowTemplateData.workflow_step_template_list,
      allow_submit_when_less_audit_level:
        UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('更新审批流程模版成功')).toBeInTheDocument();
    expect(getAllBySelector('a').length).toBe(2);
    expect(getAllBySelector('a')?.[1]).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/progress`
    );
  });

  it('render update workflow template and submit failed', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const updateInfoRequest = workflowTemplate.updateWorkflowTemplate();
    updateInfoRequest.mockImplementation(() =>
      createSpySuccessResponse({
        code: 500,
        message: 'error'
      })
    );
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userInfoRequest).toBeCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.click(screen.getByText('保 存'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(updateInfoRequest).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_step_template_list:
        workflowTemplateData.workflow_step_template_list,
      allow_submit_when_less_audit_level:
        UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
    });
  });

  it('update workflow template info', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const updateInfoRequest = workflowTemplate.updateWorkflowTemplate();
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userInfoRequest).toBeCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search-input'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(3000));
    });
    expect(getAllBySelector('.ant-card').length).toBe(5);
    fireEvent.click(getAllBySelector('.ant-card')?.[2]);
    await act(async () => {
      fireEvent.click(getBySelector('.add-review-node-icon button'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(getAllBySelector('.ant-card').length).toBe(6);
    expect(getBySelector('#desc')).toBeInTheDocument();
    fireEvent.change(getBySelector('#desc'), {
      target: { value: 'desc' }
    });
    fireEvent.click(getBySelector('#approved_by_authorized'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search-input'));
    const userSelectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(userSelectOptions[1]);
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(screen.getAllByText('admin')?.[0]).toBeInTheDocument();
    fireEvent.click(screen.getByText('保 存'));
    await act(async () => jest.advanceTimersByTime(3000));
    const tempList: IWorkFlowStepTemplateResV1[] =
      cloneDeep(workflowTemplateData).workflow_step_template_list;
    tempList.splice(tempList.length - 1, 0, {
      approved_by_authorized: false,
      assignee_user_id_list: ['700300'],
      desc: 'desc',
      type: 'sql_review'
    });
    expect(updateInfoRequest).toBeCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_step_template_list: tempList,
      allow_submit_when_less_audit_level:
        UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.normal
    });
  });

  it('change workflow template node number and reset template', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const userInfoRequest = user.getUserTipList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(userInfoRequest).toBeCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toBeCalled();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('上一步'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('.ant-btn-circle')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(getBySelector('.ant-btn-circle'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(getAllBySelector('.ant-card').length).toBe(4);
    expect(screen.getByText('重 置')).toBeInTheDocument();
    fireEvent.click(screen.getByText('重 置'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getAllBySelector('.ant-card').length).toBe(3);
  });
});
