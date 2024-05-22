import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import WorkflowList from '..';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { superRender } from '../../../../testUtils/customRender';
import user from '../../../../testUtils/mockApi/user';
import instance from '../../../../testUtils/mockApi/instance';
import execWorkflow from '../../../../testUtils/mockApi/execWorkflow';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import { ignoreComponentAutoCreatedListNoKey } from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/Workflow/List', () => {
  const projectName = mockProjectInfo.projectName;
  const projectID = mockProjectInfo.projectID;
  const navigateSpy = jest.fn();
  let RequestUserTipList: jest.SpyInstance;
  let RequestInstanceTipList: jest.SpyInstance;
  let RequestWorkflowList: jest.SpyInstance;
  let RequestExportWorkflowList: jest.SpyInstance;
  let RequestBatchCancel: jest.SpyInstance;

  const customRender = () => {
    return superRender(<WorkflowList />);
  };
  ignoreComponentAutoCreatedListNoKey();
  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    RequestUserTipList = user.getUserTipList();
    RequestInstanceTipList = instance.getInstanceTipList();
    RequestWorkflowList = execWorkflow.getWorkflows();
    RequestExportWorkflowList = execWorkflow.exportWorkflow();
    RequestBatchCancel = execWorkflow.batchCancelWorkflows();
    mockDatabaseType();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when list page init', async () => {
    const { baseElement } = customRender();

    expect(RequestUserTipList).toHaveBeenCalledTimes(1);
    expect(RequestInstanceTipList).toHaveBeenCalledTimes(1);
    expect(RequestWorkflowList).toHaveBeenCalledTimes(1);

    expect(RequestUserTipList).toHaveBeenCalledWith({
      filter_project: projectName
    });

    expect(RequestInstanceTipList).toHaveBeenCalledWith({
      project_name: projectName
    });

    expect(RequestWorkflowList).toHaveBeenCalledWith({
      project_name: projectName,
      filter_status: undefined,
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20
    });

    expect(baseElement).toMatchSnapshot;

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot;
  });

  it('render snap when projectArchive is false', async () => {
    mockUseCurrentProject({
      projectArchive: false
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot;
  });

  it('render btn batchCancel when is not Admin', async () => {
    mockUseCurrentUser({
      isAdmin: false
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot;
  });

  it('render snap when list is empty', async () => {
    RequestWorkflowList.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot;
  });

  it('render snap when list api return error', async () => {
    RequestWorkflowList.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot;
  });

  it('render list column diff data', async () => {
    const workflowName = 'demo-workflow_name';
    const workflowId = '1234';
    RequestWorkflowList.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            project_name: '700300',
            workflow_name: workflowName,
            workflow_id: workflowId,
            desc: 'desc demo',
            create_user_name: 'admin',
            create_time: '',
            current_step_type: 'sql_execute',
            current_step_assignee_user_name_list: [],
            status: 'wait_for_execution'
          }
        ],
        total_nums: 1
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot;

    fireEvent.click(screen.getByText(workflowName));
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/exec-workflow/${workflowId}`
    );
  });

  it('render filter when cate val change', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const WorkflowStatusSegmented = getAllBySelector(
      '.ant-segmented-item-label',
      baseElement
    );
    expect(WorkflowStatusSegmented.length).toBe(8);
    expect(WorkflowStatusSegmented[1]).toHaveAttribute('title', '待审核');
    fireEvent.click(WorkflowStatusSegmented[1]);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(RequestWorkflowList).toHaveBeenCalledWith({
      project_name: projectName,
      filter_status: 'wait_for_audit',
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20
    });
  });

  it('render fuzzy input when input fuzzy val', async () => {
    const fuzzyVal = 'fuzzy value';
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));

    const inputFuzzyEle = getBySelector(
      'input#actiontech-table-search-input',
      baseElement
    );
    fireEvent.change(inputFuzzyEle, {
      target: { value: fuzzyVal }
    });

    await act(async () => {
      fireEvent.keyDown(inputFuzzyEle, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      });
      await jest.advanceTimersByTime(300);
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestWorkflowList).toHaveBeenNthCalledWith(2, {
      project_name: projectName,
      filter_status: undefined,
      fuzzy_keyword: fuzzyVal,
      page_index: 1,
      page_size: 20
    });
  });

  it('render refresh btn when click refresh', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const refreshIcon = getBySelector('.custom-icon-refresh', baseElement);
    fireEvent.click(refreshIcon);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestWorkflowList).toHaveBeenCalledTimes(2);
  });

  it('render click create btn', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('创建工单')).toBeInTheDocument();
    const extraEle = getBySelector('div.extra', baseElement);
    expect(extraEle).toMatchSnapshot();
    const createBtn = getBySelector('a', extraEle);
    expect(createBtn).toHaveAttribute(
      'href',
      `/sqle/project/${projectID}/exec-workflow/create`
    );
  });

  it('render click export btn', async () => {
    customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('上线成功')[0]);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('导出工单')).toBeInTheDocument();
    fireEvent.click(screen.getByText('导出工单'));
    expect(RequestExportWorkflowList).toHaveBeenCalled();
    expect(RequestExportWorkflowList).toHaveBeenCalledWith(
      {
        filter_create_time_from: undefined,
        filter_create_time_to: undefined,
        filter_create_user_id: undefined,
        filter_current_step_assignee_user_id: undefined,
        filter_status: 'finished',
        filter_subject: undefined,
        filter_task_execute_start_time_from: undefined,
        filter_task_execute_start_time_to: undefined,
        filter_task_instance_name: undefined,
        fuzzy_keyword: '',
        project_name: projectName
      },
      { responseType: 'blob' }
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('历史工单导出成功')).toBeInTheDocument();
  });

  it('render click batch cancel btn when has not closed ', async () => {
    RequestWorkflowList.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            project_name: '700300',
            workflow_name: 'name1',
            workflow_id: '1',
            desc: 'desc demo',
            create_user_name: 'admin',
            create_time: '',
            current_step_type: 'sql_execute',
            current_step_assignee_user_name_list: [],
            status: 'wait_for_execution'
          },
          {
            project_name: '700300',
            workflow_name: 'name2',
            workflow_id: '2',
            desc: 'desc demo2',
            create_user_name: ['admin', 'test'],
            create_time: '',
            current_step_type: 'sql_execute',
            current_step_assignee_user_name_list: [],
            status: 'wait_for_audit'
          },
          {
            project_name: '700300',
            workflow_name: 'name3',
            workflow_id: '3',
            desc: 'desc demo3',
            create_user_name: ['test'],
            create_time: '',
            current_step_type: 'sql_execute',
            current_step_assignee_user_name_list: [],
            status: 'rejected'
          },
          {
            project_name: '700300',
            workflow_name: 'name4',
            workflow_id: '4',
            desc: 'desc demo4',
            create_user_name: ['admin'],
            create_time: '',
            current_step_type: 'sql_execute',
            current_step_assignee_user_name_list: [],
            status: 'canceled'
          }
        ],
        total_nums: 4
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const checkboxEle = getAllBySelector(
      '.ant-checkbox-wrapper .ant-checkbox-input',
      baseElement
    );
    expect(checkboxEle.length).toBe(5);
    fireEvent.click(checkboxEle[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getAllBySelector(
        '.ant-checkbox-wrapper-checked .ant-checkbox-input',
        baseElement
      )
    );
    expect(checkboxEle.length).toBe(5);

    fireEvent.click(screen.getByText('批量关闭'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('您确认关闭所选工单吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText(
        '您所选的工单包含不可关闭的工单!（只有工单状态为“处理中”和“已驳回”的工单可以关闭。）'
      )
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render click batch cancel when action success', async () => {
    RequestWorkflowList.mockImplementation(() =>
      createSpySuccessResponse({
        data: [
          {
            project_name: '700300',
            workflow_name: 'name1',
            workflow_id: '1',
            desc: 'desc demo',
            create_user_name: 'admin',
            create_time: '',
            current_step_type: 'sql_execute',
            current_step_assignee_user_name_list: [],
            status: 'wait_for_execution'
          }
        ],
        total_nums: 1
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    const checkboxEle = getAllBySelector(
      '.ant-checkbox-wrapper .ant-checkbox-input',
      baseElement
    );
    expect(checkboxEle.length).toBe(2);
    fireEvent.click(checkboxEle[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      getAllBySelector(
        '.ant-checkbox-wrapper-checked .ant-checkbox-input',
        baseElement
      )
    );
    expect(checkboxEle.length).toBe(2);

    fireEvent.click(screen.getByText('批量关闭'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('您确认关闭所选工单吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestBatchCancel).toHaveBeenCalledTimes(1);
    expect(RequestBatchCancel).toHaveBeenCalledWith({
      project_name: projectName,
      workflow_id_list: ['1']
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestWorkflowList).toHaveBeenCalledTimes(2);
  });
});
