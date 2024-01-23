import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';

import { ModifySQLProps } from './index.type';
import ModifySQL from '.';

import order from '../../../../testUtils/mockApi/order';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { AuditTaskResData } from '../../../../testUtils/mockApi/order/data';

const projectName = 'project name';
const projectID = 'project ID';
const workflowID = 'workflow ID';

describe('sqle/Order/Detail/ModifySQL', () => {
  const auditFn = jest.fn();
  const refreshOrderFn = jest.fn();
  const refreshOverviewActionFn = jest.fn();
  const cancelFn = jest.fn();

  let requestUpdateWorkflow: jest.SpyInstance;

  const customRender = (customParams: Partial<ModifySQLProps> = {}) => {
    const params: ModifySQLProps = {
      open: false,
      isDisableFinallySubmitButton: false,
      disabledOperatorOrderBtnTips: 'disabled Order Btn Tips',
      audit: auditFn,
      refreshOrder: refreshOrderFn,
      refreshOverviewAction: refreshOverviewActionFn,
      cancel: cancelFn,
      currentOrderTasks: [],
      modifiedOrderTasks: [],
      sqlMode: WorkflowResV2ModeEnum.same_sqls,
      projectName,
      projectID,
      workflowID
    };
    return superRender(<ModifySQL {...params} {...customParams} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    order.mockAllApi();
    requestUpdateWorkflow = order.updateWorkflow();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open is true', async () => {
    const { baseElement } = customRender({
      open: true,
      currentOrderTasks: [AuditTaskResData[0]],
      modifiedOrderTasks: [AuditTaskResData[1]]
    });

    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText('修改审核语句')).toBeInTheDocument();
    expect(screen.getByText('输入SQL语句')).toBeInTheDocument();
    expect(screen.getByText('上传SQL文件')).toBeInTheDocument();
    expect(screen.getByText('上传ZIP文件')).toBeInTheDocument();

    expect(screen.getByText('返回工单详情')).toBeInTheDocument();
    fireEvent.click(screen.getByText('返回工单详情'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(cancelFn).toBeCalled();

    expect(screen.getByText('提交工单')).toBeInTheDocument();
    fireEvent.click(screen.getByText('提交工单'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(requestUpdateWorkflow).toBeCalled();
    expect(requestUpdateWorkflow).toBeCalledWith({
      project_name: projectName,
      workflow_id: workflowID,
      task_ids: [2]
    });
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click sql audit btn', async () => {
    customRender({
      open: true,
      currentOrderTasks: [AuditTaskResData[0]],
      modifiedOrderTasks: [AuditTaskResData[1]]
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('审 核')).toBeInTheDocument();
    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(auditFn).toBeCalled();
  });

  it('render snap when click input sql', async () => {
    customRender({
      open: true,
      currentOrderTasks: [AuditTaskResData[0]],
      modifiedOrderTasks: [AuditTaskResData[1]]
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('输入SQL语句')).toBeInTheDocument();
    fireEvent.click(screen.getByText('输入SQL语句'));
    await act(async () => jest.advanceTimersByTime(500));
  });

  it('render snap when click formatter sql', async () => {
    const { baseElement } = customRender({
      open: true,
      currentOrderTasks: [AuditTaskResData[0]],
      modifiedOrderTasks: [AuditTaskResData[1]]
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('SQL美化')).toBeInTheDocument();
    fireEvent.click(screen.getByText('SQL美化'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
