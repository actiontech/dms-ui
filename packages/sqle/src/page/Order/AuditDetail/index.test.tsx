import AuditDetail from '.';
import { OrderDetailAuditResultProps } from './index.type';

import MockDate from 'mockdate';
import dayjs from 'dayjs';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtils/customRender';

import order from '../../../testUtils/mockApi/order';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  AuditTaskResData,
  workflowsOverviewListData
} from '../../../testUtils/mockApi/order/data';
import { IWorkflowResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  AuditTaskResV1StatusEnum,
  WorkflowRecordResV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';

const projectName = 'project name';

describe('sqle/Order/AuditDetail', () => {
  const refreshOrderFn = jest.fn();
  const getOverviewListSuccessFn = jest.fn();

  let requestGetAuditTaskSQLs: jest.SpyInstance;

  const customRender = (
    params: Omit<
      OrderDetailAuditResultProps,
      'projectName' | 'getOverviewListSuccessHandle' | 'refreshOrder'
    >
  ) => {
    return renderWithTheme(
      <AuditDetail
        {...params}
        projectName={projectName}
        refreshOrder={refreshOrderFn}
        getOverviewListSuccessHandle={getOverviewListSuccessFn}
      />
    );
  };

  beforeEach(() => {
    MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());
    jest.useFakeTimers();
    order.mockAllApi();
    mockUseCurrentUser();
    requestGetAuditTaskSQLs = order.getAuditTaskSQLs();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    MockDate.reset();
    cleanup();
  });

  it('render snap when no taskInfos', async () => {
    const { baseElement } = customRender({
      taskInfos: [],
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has order info data', async () => {
    const { baseElement } = customRender({
      taskInfos: AuditTaskResData,
      orderInfo: workflowsOverviewListData as unknown as IWorkflowResV2,
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();

    const segmentItems = getAllBySelector(
      '.instance-segmented-label',
      baseElement
    );
    expect(segmentItems.length).toBe(AuditTaskResData.length);

    fireEvent.click(segmentItems[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2800));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
  });

  it('render snap when order info has action btn', async () => {
    const { baseElement } = customRender({
      taskInfos: [
        {
          ...AuditTaskResData[0],
          status: AuditTaskResV1StatusEnum.exec_success
        },
        {
          ...AuditTaskResData[1],
          status: AuditTaskResV1StatusEnum.initialized
        }
      ],
      orderInfo: {
        ...workflowsOverviewListData,
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_execution,
          workflow_step_list: []
        },
        record_history_list: []
      } as unknown as IWorkflowResV2,
      isArchive: true,
      refreshOverviewFlag: false
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();

    const segmentItems = getAllBySelector(
      '.instance-segmented-label',
      baseElement
    );
    fireEvent.click(segmentItems[1]);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
    expect(screen.getByText('筛选')).toBeInTheDocument();
    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('收起筛选')).toBeInTheDocument();
    fireEvent.click(screen.getByText('收起筛选'));
    await act(async () => jest.advanceTimersByTime(300));
  });

  it('render snap when click detail action', async () => {
    const { baseElement } = customRender({
      taskInfos: [
        {
          ...AuditTaskResData[0],
          status: AuditTaskResV1StatusEnum.exec_success
        },
        {
          ...AuditTaskResData[1],
          status: AuditTaskResV1StatusEnum.initialized
        }
      ],
      orderInfo: {
        ...workflowsOverviewListData,
        record: {
          status: WorkflowRecordResV2StatusEnum.wait_for_execution,
          workflow_step_list: []
        },
        record_history_list: []
      } as unknown as IWorkflowResV2,
      isArchive: true,
      refreshOverviewFlag: false
    });
    await act(async () => jest.advanceTimersByTime(3300));

    const segmentItems = getAllBySelector(
      '.instance-segmented-label',
      baseElement
    );
    fireEvent.click(segmentItems[1]);

    const statusItems = getAllBySelector(
      '.audit-result-filter-container-borderless > div .ant-space-item'
    );
    expect(statusItems.length).toBe(12);
    expect(screen.getByText('执行失败')).toBeInTheDocument();
    fireEvent.click(screen.getByText('执行失败'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).nthCalledWith(1, {
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });

    expect(screen.getByText('数据去重')).toBeInTheDocument();
    fireEvent.click(screen.getByText('数据去重'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).nthCalledWith(2, {
      filter_exec_status: 'failed',
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
    expect(requestGetAuditTaskSQLs).nthCalledWith(3, {
      filter_exec_status: 'failed',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });

    expect(screen.getByText('分页展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分页展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('瀑布流展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('瀑布流展示'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).nthCalledWith(4, {
      filter_exec_status: 'failed',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
  });
});
