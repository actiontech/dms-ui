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
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import {
  AuditTaskResV1StatusEnum,
  WorkflowRecordResV2StatusEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IAuditTaskSQLResV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';

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
    // date picker : custom attr [hideSuperIcon]
    jest.spyOn(console, 'error').mockImplementation(() => {});
    order.mockAllApi();
    mockUseCurrentUser();
    requestGetAuditTaskSQLs = order.getAuditTaskSQLs();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    MockDate.reset();
    (console.error as jest.Mock).mockRestore();
    cleanup();
  });

  it('render snap when no taskInfos', () => {
    const { baseElement } = customRender({
      taskInfos: [],
      isArchive: true,
      refreshOverviewFlag: true
    });
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
    expect(requestGetAuditTaskSQLs).toBeCalled();
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
    expect(requestGetAuditTaskSQLs).toBeCalled();
    expect(requestGetAuditTaskSQLs).toBeCalledWith({
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

    const actionList = getBySelector('.audit-result-actions-wrap').children;
    fireEvent.click(actionList[3]);
    await act(async () => jest.advanceTimersByTime(100));
    fireEvent.click(screen.getByText('分页展示'));
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(segmentItems[0]);
  });

  it('render snap when refresh waterfall list', async () => {
    const updateAuditTaskSQLsSpy = order.updateAuditTaskSQLs();
    const mockListData: IAuditTaskSQLResV2[] = [];
    for (let i = 0; i < 20; i++) {
      mockListData.push({
        number: i + 1,
        audit_level: '',
        audit_result: [
          {
            level: 'level'
          }
        ],
        audit_status: 'audit_status' + i,
        description: 'description' + i,
        exec_result: 'exec_result' + i,
        exec_sql: 'exec_sql' + i,
        exec_status: 'exec_status' + i,
        rollback_sql: 'rollback_sql' + i
      });
    }
    requestGetAuditTaskSQLs.mockClear();
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockListData,
        total_nums: 30
      })
    );
    const { baseElement } = renderWithTheme(
      <div id="test-wrap" style={{ height: '1000px', overflow: 'auto' }}>
        <AuditDetail
          taskInfos={[
            {
              ...AuditTaskResData[0],
              status: AuditTaskResV1StatusEnum.exec_success
            },
            {
              ...AuditTaskResData[1],
              status: AuditTaskResV1StatusEnum.initialized
            }
          ]}
          orderInfo={{
            ...workflowsOverviewListData,
            record: {
              status: WorkflowRecordResV2StatusEnum.wait_for_execution,
              workflow_step_list: []
            },
            record_history_list: []
          }}
          isArchive={true}
          refreshOverviewFlag={false}
          projectName={projectName}
          refreshOrder={refreshOrderFn}
          getOverviewListSuccessHandle={getOverviewListSuccessFn}
        />
      </div>
    );
    await act(async () => jest.advanceTimersByTime(3300));

    const segmentItems = getAllBySelector(
      '.instance-segmented-label',
      baseElement
    );
    fireEvent.click(segmentItems[1]);

    await act(async () => jest.advanceTimersByTime(3300));
    expect(requestGetAuditTaskSQLs).nthCalledWith(1, {
      filter_exec_status: undefined,
      no_duplicate: false,
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
    expect(requestGetAuditTaskSQLs).nthCalledWith(2, {
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '1',
      page_size: '20',
      task_id: '2'
    });
    await act(async () => {
      fireEvent.scroll(getBySelector('#test-wrap'), {
        y: 8000
      });
      await jest.advanceTimersByTime(3100);
    });
    expect(requestGetAuditTaskSQLs).nthCalledWith(3, {
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '2',
      page_size: '20',
      task_id: '2'
    });

    const inputEle = getAllBySelector('.result-describe-input')[21];
    await act(async () => {
      fireEvent.change(inputEle, {
        target: {
          value: 'descriptionTest1'
        }
      });
      await jest.advanceTimersByTime(100);
    });
    await act(async () => {
      fireEvent.blur(inputEle);
      await jest.advanceTimersByTime(100);
    });
    expect(updateAuditTaskSQLsSpy).nthCalledWith(1, {
      description: 'descriptionTest1',
      number: '2',
      task_id: '2'
    });
    await act(async () => jest.advanceTimersByTime(3000));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestGetAuditTaskSQLs).nthCalledWith(4, {
      filter_exec_status: undefined,
      no_duplicate: false,
      page_index: '2',
      page_size: '20',
      task_id: '2'
    });
  });
});
