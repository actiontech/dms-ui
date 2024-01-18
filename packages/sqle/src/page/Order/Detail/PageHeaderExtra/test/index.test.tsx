import { OrderDetailPageHeaderExtraProps } from '../index.type';
import OrderDetailPageHeaderExtra from '..';

import { cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

type paramsType = Pick<
  OrderDetailPageHeaderExtraProps,
  | 'orderInfo'
  | 'maintenanceTimeInfo'
  | 'canRejectOrder'
  | 'orderStepVisibility'
  | 'isArchive'
>;

describe('sqle/Order/Detail/OrderDetailPageHeaderExtra', () => {
  const passFn = jest.fn();
  const rejectFn = jest.fn();
  const executingFn = jest.fn();
  const completeFn = jest.fn();
  const terminateFn = jest.fn();
  const openOrderStepFn = jest.fn();
  const refreshOrderFn = jest.fn();

  const customRender = (params: paramsType) => {
    return renderWithTheme(
      <OrderDetailPageHeaderExtra
        projectName="project Name"
        refreshOrder={refreshOrderFn}
        pass={passFn}
        reject={rejectFn}
        executing={executingFn}
        complete={completeFn}
        terminate={terminateFn}
        openOrderStep={openOrderStepFn}
        {...params}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender({ orderStepVisibility: true, isArchive: false });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when btn is hidden', () => {
    const { baseElement } = customRender({
      orderStepVisibility: true,
      isArchive: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when btn is hidden', () => {
    const { baseElement } = customRender({
      orderStepVisibility: true,
      isArchive: true,
      orderInfo: {
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_audit
        }
      }
    });
    expect(baseElement).toMatchSnapshot();
  });
});
