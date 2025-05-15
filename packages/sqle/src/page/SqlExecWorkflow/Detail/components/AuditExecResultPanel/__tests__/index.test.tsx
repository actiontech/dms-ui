import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import AuditExecResultPanel from '..';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import {
  AuditTaskResData,
  WorkflowTasksItemData,
  WorkflowsOverviewListData,
  workflowsDetailData
} from '../../../../../../testUtils/mockApi/execWorkflow/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../hooks/useAuditExecResultPanelSetup';
import { fireEvent, screen } from '@testing-library/dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { AuditExecResultPanelProps } from '../index.type';
import { act } from '@testing-library/react';
import task from '../../../../../../testUtils/mockApi/task';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

describe('test AuditExecResultPanel', () => {
  const activeTabChangeEvent = jest.fn();
  const refreshWorkflow = jest.fn();
  const refreshOverviewAction = jest.fn();
  const customRender = (params?: Partial<AuditExecResultPanelProps>) => {
    return sqleSuperRender(
      <AuditExecResultPanel
        activeTabKey={WORKFLOW_OVERVIEW_TAB_KEY}
        activeTabChangeEvent={activeTabChangeEvent}
        taskInfos={AuditTaskResData}
        workflowInfo={WorkflowsOverviewListData}
        refreshWorkflow={refreshWorkflow}
        overviewList={{
          list: WorkflowTasksItemData,
          total: WorkflowTasksItemData.length
        }}
        refreshOverviewAction={refreshOverviewAction}
        getOverviewLoading={false}
        overviewTableErrorMessage={''}
        {...params}
      />
    );
  };

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    task.mockAllApi();
    mockUsePermission(undefined, {
      mockSelector: true
    });
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('matches snapshot with default setup', () => {
    const { container } = customRender();

    expect(container).toMatchSnapshot();
    expect(screen.getByText('概览').parentNode).toHaveClass(
      'ant-segmented-item-selected'
    );
  });

  it('matches snapshot and selects task on initial render', async () => {
    const { container } = customRender({
      activeTabKey: AuditTaskResData[0].task_id?.toString()
    });
    expect(container).toMatchSnapshot();

    expect(
      screen.getByText(AuditTaskResData[0].instance_name?.toString()!)
        .parentNode?.parentNode?.parentNode
    ).toHaveClass('ant-segmented-item-selected');

    fireEvent.click(screen.getByText('概览'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(activeTabChangeEvent).toHaveBeenCalledTimes(1);
    expect(activeTabChangeEvent).toHaveBeenCalledWith(
      WORKFLOW_OVERVIEW_TAB_KEY
    );

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('updates layout to waterfall and retrieves task SQLs', async () => {
    const getTaskSQLsSpy = task.getAuditTaskSQLs();
    const { container } = customRender({
      activeTabKey: AuditTaskResData[0].task_id?.toString()
    });
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('分页展示')).toBeInTheDocument();

    fireEvent.click(screen.getByText('分页展示'));

    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(screen.getByText('瀑布流展示'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });
});
