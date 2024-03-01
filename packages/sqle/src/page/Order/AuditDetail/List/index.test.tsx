import OrderDetailAuditResultList from '.';
import { OrderDetailAuditResultListProps } from './index.type';

import { renderWithThemeAndRedux } from '../../../../testUtils/customRender';
import { cleanup, act } from '@testing-library/react';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import order from '../../../../testUtils/mockApi/order';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const workflowID = 'workflow ID';
const projectName = 'project Name default';

describe('sqle/Order/AuditDetail/OrderDetailAuditResultList', () => {
  const getOverviewListSuccessFn = jest.fn();
  const setAuditResultActiveKeyFn = jest.fn();
  const refreshOrderFn = jest.fn();

  let requestGetSummaryOfInstanceTasks: jest.SpyInstance;

  const customRender = (
    params: {
      orderStatus?: WorkflowRecordResV2StatusEnum;
      isArchive: boolean;
      refreshOverviewFlag: boolean;
    } = {
      isArchive: false,
      refreshOverviewFlag: false
    }
  ) => {
    const defaultParams: OrderDetailAuditResultListProps = {
      workflowID,
      projectName,
      getOverviewListSuccessHandle: getOverviewListSuccessFn,
      setAuditResultActiveKey: setAuditResultActiveKeyFn,
      refreshOrder: refreshOrderFn,
      ...params
    };
    return renderWithThemeAndRedux(
      <OrderDetailAuditResultList {...defaultParams} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    order.mockAllApi();
    requestGetSummaryOfInstanceTasks = order.getSummaryOfInstanceTasks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap list when isArchive is false', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2000));
    expect(requestGetSummaryOfInstanceTasks).toHaveBeenCalled();
    expect(requestGetSummaryOfInstanceTasks).toHaveBeenCalledWith({
      workflow_id: workflowID,
      project_name: projectName
    });
  });

  it('render snap list when isArchive is true', async () => {
    const { baseElement } = customRender({
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetSummaryOfInstanceTasks).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });
});
