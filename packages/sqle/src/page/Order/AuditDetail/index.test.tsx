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
import {
  IAuditTaskSQLResV2,
  IWorkflowResV2
} from '@actiontech/shared/lib/api/sqle/service/common';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  AuditTaskResV1StatusEnum,
  WorkflowRecordResV2StatusEnum,
  WorkflowResV2ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { ignoreComponentCustomAttr } from '@actiontech/shared/lib/testUtil/common';

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

  ignoreComponentCustomAttr();

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
    const { baseElement } = await act(async () =>
      customRender({
        taskInfos: [],
        isArchive: true,
        refreshOverviewFlag: true
      })
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has single taskInfos', async () => {
    const { baseElement } = customRender({
      taskInfos: [AuditTaskResData[0]],
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when has more taskInfos', async () => {
    const { baseElement } = customRender({
      taskInfos: AuditTaskResData,
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(3100));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click instance name is empty', async () => {
    const { baseElement } = customRender({
      taskInfos: [
        {
          ...AuditTaskResData[0],
          instance_name: ''
        }
      ],
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(3100));

    const segmentedLabelItems = getAllBySelector(
      '.ant-segmented-item-label',
      baseElement
    );
    expect(segmentedLabelItems.length).toBe(2);
    expect(segmentedLabelItems[1]).toHaveAttribute('title', '-');
    fireEvent.click(segmentedLabelItems[1]);
    await act(async () => jest.advanceTimersByTime(300));
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
    expect(requestGetAuditTaskSQLs).toHaveBeenNthCalledWith(1, {
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });

    expect(screen.getByText('数据去重')).toBeInTheDocument();
    fireEvent.click(screen.getByText('数据去重'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenNthCalledWith(2, {
      filter_exec_status: 'failed',
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
    expect(requestGetAuditTaskSQLs).toHaveBeenNthCalledWith(3, {
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
    expect(requestGetAuditTaskSQLs).toHaveBeenNthCalledWith(4, {
      filter_exec_status: 'failed',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
    fireEvent.click(screen.getAllByText('瀑布流展示')?.[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('分页展示')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分页展示'));
    await act(async () => jest.advanceTimersByTime(300));
    const recordItem = getAllBySelector('.download-record-item', baseElement);
    expect(recordItem.length).toBe(2);
    fireEvent.click(recordItem[1]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
    await act(async () => {
      fireEvent.click(screen.getByText('概览'));
    });
  });

  it('render snap when change segmented tab & change page index & duplicate', async () => {
    const taskSQLsData: IAuditTaskSQLResV2[] = [];
    for (let i = 0; i < 50; i++) {
      const index = i + 1;
      taskSQLsData.push({
        number: index,
        exec_sql: 'SELECT * from ' + index,
        sql_source_file: '',
        audit_level: '',
        audit_status: 'finished',
        exec_result: '',
        exec_status: 'initialized',
        description: ''
      });
    }
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpySuccessResponse({
        data: taskSQLsData,
        total_nums: taskSQLsData.length
      })
    );
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
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
    expect(baseElement).toMatchSnapshot();

    const paginationItems = getAllBySelector(
      '.ant-pagination-item',
      baseElement
    );
    expect(paginationItems.length).toBe(3);
    fireEvent.click(paginationItems[2]);
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '3',
      page_size: '20',
      task_id: '2'
    });
    fireEvent.click(screen.getByText('数据去重'));
    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_exec_status: undefined,
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
  });

  it('render snap when exec_mode is equal sql_file', async () => {
    const { baseElement } = customRender({
      taskInfos: AuditTaskResData,
      orderInfo: {
        ...workflowsOverviewListData,
        exec_mode: WorkflowResV2ExecModeEnum.sql_file
      } as unknown as IWorkflowResV2,
      isArchive: true,
      refreshOverviewFlag: true
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
