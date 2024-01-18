import { orderListData } from '../../../../../testUtils/mockApi/order/data';
import { renderHooksWithRedux } from '../../../../../testUtils/customRender';
import { cleanup, act } from '@testing-library/react';

import useOrderDetailActions from '../useOrderDetailActions';
import { OrderDetailPageHeaderExtraProps } from '../index.type';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('sqle/Order/Detail/useOrderDetailActions', () => {
  const refreshOrderFn = jest.fn();
  const passFn = jest.fn();
  const rejectFn = jest.fn();
  const executingFn = jest.fn();
  const completeFn = jest.fn();
  const terminateFn = jest.fn();
  const openOrderStepFn = jest.fn();

  const customRender = (
    params: Partial<
      Pick<
        OrderDetailPageHeaderExtraProps,
        'canRejectOrder' | 'orderStepVisibility' | 'isArchive'
      >
    > = {}
  ) => {
    return renderHooksWithRedux(() =>
      useOrderDetailActions({
        projectName: 'project name',
        orderInfo: {
          ...orderListData[1],
          record: {
            status: WorkflowRecordResV2StatusEnum.wait_for_audit
          }
        },
        refreshOrder: refreshOrderFn,
        pass: passFn,
        reject: rejectFn,
        executing: executingFn,
        complete: completeFn,
        terminate: terminateFn,
        openOrderStep: openOrderStepFn,
        maintenanceTimeInfo: [
          {
            instanceName: 'instance name',
            maintenanceTime: []
          }
        ],
        canRejectOrder: false,
        orderStepVisibility: false,
        isArchive: false,
        ...params
      })
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it('render closed btn', async () => {
    const { result } = customRender();
    expect(result.current.closeOrderButtonMeta.loading).toBeFalsy();

    await act(async () => {
      result.current.closeOrderButtonMeta.action();
      await act(async () => jest.advanceTimersByTime(500));
    });
  });
});
