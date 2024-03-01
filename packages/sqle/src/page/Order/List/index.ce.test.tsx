/**
 * @test_version ce
 */

import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { superRender } from '../../../testUtils/customRender';

import order from '../../../testUtils/mockApi/order';
import user from '../../../testUtils/mockApi/user';
import instance from '../../../testUtils/mockApi/instance';
import { mockDatabaseType } from '../../../testUtils/mockHooks/mockDatabaseType';

import OrderList from '.';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('sqle/Order/List', () => {
  const projectName = mockProjectInfo.projectName;
  const projectID = mockProjectInfo.projectID;
  const navigateSpy = jest.fn();
  let RequestUserTipList: jest.SpyInstance;
  let RequestInstanceTipList: jest.SpyInstance;
  let RequestOrderList: jest.SpyInstance;
  let RequestBatchCancel: jest.SpyInstance;

  const customRender = () => {
    return superRender(<OrderList />);
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest.useFakeTimers();
    mockDatabaseType();
    RequestUserTipList = user.getUserTipList();
    RequestInstanceTipList = instance.getInstanceTipList();
    RequestOrderList = order.getWorkflows();
    RequestBatchCancel = order.batchCancelWorkflows();
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

    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestUserTipList).toHaveBeenCalledWith({
      filter_project: projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestInstanceTipList).toHaveBeenCalledWith({
      project_name: projectName
    });

    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot;
    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestOrderList).toHaveBeenCalledWith({
      project_name: projectName,
      filter_status: undefined,
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20
    });
    expect(baseElement).toMatchSnapshot;
  });

  it('render snap when projectArchive is false', async () => {
    mockUseCurrentProject({
      projectArchive: false
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(baseElement).toMatchSnapshot;
  });

  it('render btn batchCancel when is not Admin', async () => {
    mockUseCurrentUser({
      isAdmin: false
    });
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(baseElement).toMatchSnapshot;
  });

  it('render snap when list is empty', async () => {
    RequestOrderList.mockImplementation(() => createSpySuccessResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(RequestOrderList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot;
  });

  it('render snap when list api return error', async () => {
    RequestOrderList.mockImplementation(() => createSpyFailResponse({}));
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(RequestOrderList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot;
  });

  it('render list column diff data', async () => {
    const workflowName = 'demo-workflow_name';
    const workflowId = '1234';
    RequestOrderList.mockImplementation(() =>
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
    await act(async () => jest.advanceTimersByTime(9300));
    expect(RequestOrderList).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot;

    fireEvent.click(screen.getByText(workflowName));
    await act(async () => jest.advanceTimersByTime(300));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectID}/order/${workflowId}`
    );
  });

  it('render filter when cate val change', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(RequestOrderList).toHaveBeenCalledWith({
      project_name: projectName,
      filter_status: undefined,
      fuzzy_keyword: '',
      page_index: 1,
      page_size: 20
    });

    const OrderStatusSegmented = getAllBySelector(
      '.ant-segmented-item-label',
      baseElement
    );
    expect(OrderStatusSegmented.length).toBe(8);
    expect(OrderStatusSegmented[1]).toHaveAttribute('title', '待审核');
    fireEvent.click(OrderStatusSegmented[1]);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(RequestOrderList).toHaveBeenCalledWith({
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
    expect(RequestOrderList).toHaveBeenCalled();

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
    expect(RequestOrderList).nthCalledWith(2, {
      project_name: projectName,
      filter_status: undefined,
      fuzzy_keyword: fuzzyVal,
      page_index: 1,
      page_size: 20
    });
  });

  it('render refresh btn when click refresh', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(RequestOrderList).toHaveBeenCalled();

    const refreshIcon = getBySelector('.custom-icon-refresh', baseElement);
    fireEvent.click(refreshIcon);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(RequestOrderList).toHaveBeenCalled();
  });

  it('render click create btn', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('创建工单')).toBeInTheDocument();
    const extraEle = getBySelector('div.extra', baseElement);
    expect(extraEle).toMatchSnapshot();
    const createBtn = getBySelector('a', extraEle);
    expect(createBtn).toHaveAttribute(
      'href',
      `/sqle/project/${projectID}/order/create`
    );
  });

  it('render click batch cancel btn when has not closed ', async () => {
    RequestOrderList.mockImplementation(() =>
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
    await act(async () => jest.advanceTimersByTime(9300));
    expect(RequestOrderList).toHaveBeenCalled();

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
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('您确认关闭所选工单吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(
      screen.getByText(
        '您所选的工单包含不可关闭的工单!（只有工单状态为“处理中”和“已驳回”的工单可以关闭。）'
      )
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render click batch cancel when action success', async () => {
    RequestOrderList.mockImplementation(() =>
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
    await act(async () => jest.advanceTimersByTime(9300));
    expect(RequestOrderList).toHaveBeenCalled();

    const checkboxEle = getAllBySelector(
      '.ant-checkbox-wrapper .ant-checkbox-input',
      baseElement
    );
    expect(checkboxEle.length).toBe(2);
    fireEvent.click(checkboxEle[0]);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(
      getAllBySelector(
        '.ant-checkbox-wrapper-checked .ant-checkbox-input',
        baseElement
      )
    );
    expect(checkboxEle.length).toBe(2);

    fireEvent.click(screen.getByText('批量关闭'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByText('您确认关闭所选工单吗？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(RequestBatchCancel).toHaveBeenCalled();
    expect(RequestBatchCancel).toHaveBeenCalledWith({
      project_name: projectName,
      workflow_id_list: ['1']
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(RequestOrderList).toHaveBeenCalled();
  });
});
