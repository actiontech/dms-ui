import { screen, cleanup, act, fireEvent } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';

import { ModifySQLProps } from './index.type';
import ModifySQL from '.';

import order from '../../../../testUtils/mockApi/order';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { AuditTaskResData } from '../../../../testUtils/mockApi/order/data';

describe('sqle/Order/Detail/ModifySQL', () => {
  const auditFn = jest.fn();
  const refreshOrderFn = jest.fn();
  const refreshOverviewActionFn = jest.fn();
  const cancelFn = jest.fn();

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
      projectName: 'project name',
      projectID: 'project ID',
      workflowID: 'workflow ID'
    };
    return superRender(<ModifySQL {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    order.mockAllApi();
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
    // const requestGetAuditTaskSQLContent = order.getAuditTaskSQLContent();
    const { baseElement } = customRender({
      open: true,
      currentOrderTasks: [AuditTaskResData[0]],
      modifiedOrderTasks: [AuditTaskResData[1]]
    });

    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
