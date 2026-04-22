import { sqleSuperRender } from '../../../testUtils/superRender';
import UpdateWorkflowTemplate from '.';
import { workflowTemplateData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate/data';
import { act, fireEvent, screen, cleanup } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import workflowTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/workflowTemplate';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useParams } from 'react-router-dom';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { cloneDeep } from 'lodash';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import user from '@actiontech/shared/lib/testUtil/mockApi/sqle/user';
import { useTypedQuery } from '@actiontech/shared';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn()
}));

jest.mock('@actiontech/shared', () => ({
  ...jest.requireActual('@actiontech/shared'),
  useTypedQuery: jest.fn()
}));

describe('page/WorkflowTemplate/UpdateWorkflowTemplate', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.UNCONNECTED_FORM_COMPONENT
  ]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const extractQuerySpy = jest.fn();

  const customRender = () => {
    return sqleSuperRender(<UpdateWorkflowTemplate />);
  };

  beforeEach(() => {
    useParamsMock.mockReturnValue({
      workflowName: workflowTemplateData.workflow_template_name
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    jest.useFakeTimers();
    workflowTemplate.mockAllApi();
    (useTypedQuery as jest.Mock).mockImplementation(() => extractQuerySpy);
    extractQuerySpy.mockReturnValue({ workflowType: 'workflow' });
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
    expect(userInfoRequest).toHaveBeenCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('编辑审批流程 - 上线工单')).toBeInTheDocument();
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
    expect(updateInfoRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: 'workflow',
      workflow_step_template_list:
        workflowTemplateData.workflow_step_template_list,
      allow_submit_when_less_audit_level:
        UpdateWorkflowTemplateReqV1AllowSubmitWhenLessAuditLevelEnum.warn
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('更新审批流程模板成功')).toBeInTheDocument();
    expect(getAllBySelector('a').length).toBe(2);
    expect(getAllBySelector('a')?.[1]).toHaveAttribute(
      'href',
      `/sqle/project/${mockProjectInfo.projectID}/progress?activeTab=workflow`
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
    expect(userInfoRequest).toHaveBeenCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => {
      fireEvent.click(screen.getByText('保 存'));
      await act(async () => jest.advanceTimersByTime(300));
    });
    expect(updateInfoRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: 'workflow',
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
    expect(userInfoRequest).toHaveBeenCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toHaveBeenCalled();
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
    expect(updateInfoRequest).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      workflow_type: 'workflow',
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
    expect(userInfoRequest).toHaveBeenCalledWith({
      filter_project: mockProjectInfo.projectName
    });
    expect(getInfoRequest).toHaveBeenCalled();
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

  it('no review node in template', async () => {
    const getInfoRequest = workflowTemplate.getWorkflowTemplate();
    const tempData = cloneDeep(workflowTemplateData);
    getInfoRequest.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          ...tempData,
          workflow_step_template_list: [tempData.workflow_step_template_list[2]]
        }
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
    expect(getAllBySelector('.ant-card').length).toBe(3);

    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(getBySelector('#execute_by_authorized'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.mouseDown(getBySelector('.ant-select-selection-search-input'));
    const selectOptions = getAllBySelector('.ant-select-item-option');
    await act(async () => {
      fireEvent.click(selectOptions[0]);
      await act(async () => jest.advanceTimersByTime(300));
    });
  });

  describe('data_export workflow type', () => {
    beforeEach(() => {
      extractQuerySpy.mockReturnValue({ workflowType: 'data_export' });
    });

    it('should render data export title when workflowType is data_export', async () => {
      workflowTemplate.getWorkflowTemplate();
      user.getUserTipList();
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));
      expect(screen.getByText('编辑审批流程 - 数据导出')).toBeInTheDocument();
    });

    it('should use export step types when workflowType is data_export', async () => {
      workflowTemplate.getWorkflowTemplate();
      const updateInfoRequest = workflowTemplate.updateWorkflowTemplate();
      user.getUserTipList();
      customRender();
      await act(async () => jest.advanceTimersByTime(3000));
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(screen.getByText('下一步'));
      await act(async () => jest.advanceTimersByTime(3000));

      await act(async () => {
        fireEvent.click(screen.getByText('保 存'));
        await act(async () => jest.advanceTimersByTime(300));
      });
      expect(updateInfoRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          workflow_type: 'data_export'
        })
      );
    });
  });
});
