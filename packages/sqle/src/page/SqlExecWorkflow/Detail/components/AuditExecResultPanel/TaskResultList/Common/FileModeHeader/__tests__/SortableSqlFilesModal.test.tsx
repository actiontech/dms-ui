import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { superRender } from '../../../../../../../../../testUtils/customRender';
import task from '../../../../../../../../../testUtils/mockApi/task';
import SortableSqlFilesModal from '../SortableSqlFilesModal';
import { SortableSQLFilesModalProps } from '../SortableSqlFilesModal/index.type';
import { act, fireEvent, screen } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('test SortableSqlFilesModal', () => {
  let updateSqlFileOrderSpy: jest.SpyInstance;
  let getAuditFileListSpy: jest.SpyInstance;

  const onClose = jest.fn();
  const taskId = '123';
  const workflowId = '567';
  const refresh = jest.fn();

  beforeEach(() => {
    updateSqlFileOrderSpy = task.updateSqlFileOrder();
    getAuditFileListSpy = task.getAuditFileList();
    mockUseCurrentProject();

    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  const customRender = (params?: Partial<SortableSQLFilesModalProps>) => {
    return superRender(
      <SortableSqlFilesModal
        open
        onClose={onClose}
        taskId={taskId}
        refresh={refresh}
        workflowId={workflowId}
        {...params}
      />
    );
  };

  it('should not render the modal when open is false', () => {
    const { baseElement } = customRender({ open: false });

    expect(baseElement).toBeInTheDocument();
    expect(getAuditFileListSpy).not.toHaveBeenCalled();
  });

  it('should render the modal when open is true', async () => {
    const { baseElement } = customRender();

    expect(baseElement).toBeInTheDocument();

    expect(getAuditFileListSpy).toHaveBeenCalledTimes(1);
    expect(getAuditFileListSpy).toHaveBeenNthCalledWith(1, {
      task_id: taskId,
      page_index: '1',
      page_size: '20'
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toBeInTheDocument();
  });

  it('should close the modal when the close button is clicked', () => {
    customRender();

    fireEvent.click(screen.getByText('关 闭'));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should reset file order and update state when reset button is clicked', async () => {
    customRender();
    expect(getAuditFileListSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('重置文件顺序'));

    expect(getAuditFileListSpy).toHaveBeenCalledTimes(2);
    expect(getAuditFileListSpy).toHaveBeenNthCalledWith(2, {
      task_id: taskId,
      page_index: '1',
      page_size: '20'
    });
  });

  it('should submit sorted files and update state when submit button is clicked', async () => {
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('提 交'));

    expect(updateSqlFileOrderSpy).toHaveBeenCalledTimes(1);
    expect(updateSqlFileOrderSpy).toHaveBeenCalledWith({
      task_id: taskId,
      workflow_id: workflowId,
      project_name: mockProjectInfo.projectName,
      files_to_sort: []
    });
  });
});
