import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import FileExecuteMode from '..';
import { FileExecuteModeProps } from '../index.type';
import { act, cleanup, screen } from '@testing-library/react';
import { TaskResultListLayoutEnum } from '../../../../index.enum';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import task from '@actiontech/shared/lib/testUtil/mockApi/sqle/task';
import { WORKFLOW_OVERVIEW_TAB_KEY } from '../../../../../../hooks/useAuditExecResultPanelSetup';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('test PaginationList/FileExecuteMode', () => {
  const customRender = (params?: Partial<FileExecuteModeProps>) => {
    const _params: FileExecuteModeProps = {
      taskId: '123',
      currentListLayout: TaskResultListLayoutEnum.pagination,
      execStatusFilterValue: null,
      auditResultActiveKey: '123',
      noDuplicate: false,
      pagination: { page_index: 1, page_size: 20 },
      tableChange: jest.fn(),
      assigneeUserNames: [mockCurrentUserReturn.username],
      workflowStatus: WorkflowRecordResV2StatusEnum.wait_for_execution,
      ...params
    };
    return sqleSuperRender(<FileExecuteMode {..._params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('should match snapshot', async () => {
    const getAuditTaskFileOverviewSpy = task.getAuditFileList();

    const { container } = customRender();

    expect(container).toMatchSnapshot();

    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledTimes(1);
    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledWith({
      task_id: '123',
      page_index: '1',
      page_size: '20'
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('render currentListLayout is equal scroll', async () => {
    const getAuditTaskFileOverviewSpy = task.getAuditTaskSQLs();

    customRender({ currentListLayout: TaskResultListLayoutEnum.scroll });

    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });

  it('render auditResultActiveKey is equal OVERVIEW_TAB_KEY', async () => {
    const getAuditTaskFileOverviewSpy = task.getAuditTaskSQLs();

    customRender({ auditResultActiveKey: WORKFLOW_OVERVIEW_TAB_KEY });

    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });

  it('does not display edit file order button if current user is not an assignee or workflow status is not wait_for_execution', () => {
    task.getAuditFileList();
    customRender({ assigneeUserNames: ['test'] });

    expect(screen.queryByText('编辑文件上线顺序')).not.toBeInTheDocument();

    cleanup();

    customRender({
      workflowStatus: WorkflowRecordResV2StatusEnum.wait_for_audit
    });
    expect(screen.queryByText('编辑文件上线顺序')).not.toBeInTheDocument();
  });
});
