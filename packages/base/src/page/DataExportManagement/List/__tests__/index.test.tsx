import userCenter from '../../../../testUtils/mockApi/userCenter';
import dbServices from '../../../../testUtils/mockApi/dbServices';
import dataExport from '../../../../testUtils/mockApi/dataExport';
import { superRender } from '../../../../testUtils/customRender';
import ExportWorkflowList from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  ListDBServiceTipsFunctionalModuleEnum,
  ListDataExportWorkflowsFilterByStatusEnum
} from '@actiontech/shared/lib/api/base/service/dms/index.enum';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { DataExportWorkflowList } from '../../../../testUtils/mockApi/dataExport/data';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('test base/DataExport/List', () => {
  let dbServiceTipsSpy: jest.SpyInstance;
  let exportWorkflowListSpy: jest.SpyInstance;
  let memberTipsSpy: jest.SpyInstance;
  const navigateSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    memberTipsSpy = userCenter.getMemberTips();
    dbServiceTipsSpy = dbServices.ListDBServicesTips();
    exportWorkflowListSpy = dataExport.ListDataExportWorkflows();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render init snapshot', async () => {
    const { container } = superRender(<ExportWorkflowList />);

    expect(container).toMatchSnapshot();

    expect(memberTipsSpy).toHaveBeenCalledTimes(1);
    expect(memberTipsSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID
    });

    expect(dbServiceTipsSpy).toHaveBeenCalledTimes(1);
    expect(dbServiceTipsSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      functional_module:
        ListDBServiceTipsFunctionalModuleEnum.create_export_task
    });

    expect(exportWorkflowListSpy).toHaveBeenCalledTimes(1);
    expect(exportWorkflowListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      fuzzy_keyword: '',
      project_uid: mockProjectInfo.projectID
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getBySelector('.custom-icon-refresh'));
    expect(exportWorkflowListSpy).toHaveBeenCalledTimes(2);
    expect(exportWorkflowListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      fuzzy_keyword: '',
      project_uid: mockProjectInfo.projectID
    });

    expect(container).toMatchSnapshot();
  });

  it('render batch close button When the user is non-admin and non-project manager', async () => {
    mockUseCurrentUser({
      isAdmin: false,
      isProjectManager: jest.fn().mockReturnValue(false)
    });

    const { container } = superRender(<ExportWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('批量关闭')).not.toBeInTheDocument();

    jest.clearAllMocks();
    cleanup();

    mockUseCurrentUser({
      isAdmin: true,
      isProjectManager: jest.fn().mockReturnValue(false)
    });
    superRender(<ExportWorkflowList />);
    expect(screen.queryByText('批量关闭')).toBeInTheDocument();

    jest.clearAllMocks();
    cleanup();

    mockUseCurrentUser({
      isAdmin: false,
      isProjectManager: jest.fn().mockReturnValue(true)
    });

    const batchCloseSpy = dataExport.batchCloseWorkflowAction();
    superRender(<ExportWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.queryByText('批量关闭')).toBeInTheDocument();
    expect(screen.getByText('批量关闭').closest('button')).toBeDisabled();
    expect(getAllBySelector('.ant-checkbox-input').length).toBe(
      DataExportWorkflowList.length + 1
    );
    fireEvent.click(getAllBySelector('.ant-checkbox-input')[0]);
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.getByText('批量关闭').closest('button')).not.toBeDisabled();

    fireEvent.click(screen.getByText('批量关闭'));
    expect(screen.getByText('您确认关闭所选导出工单吗？'));
    fireEvent.click(screen.getByText('确 认'));
    expect(batchCloseSpy).toHaveBeenCalledTimes(0);
    expect(
      screen.getByText(
        '您所选的工单包含不可关闭的工单!（只有工单状态为“待审核”和“已驳回”的工单可以关闭。）'
      )
    ).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(getAllBySelector('.ant-checkbox-input')[0]);
    fireEvent.click(getAllBySelector('.ant-checkbox-input')[2]);
    fireEvent.click(screen.getByText('批量关闭'));
    fireEvent.click(screen.getByText('确 认'));

    expect(batchCloseSpy).toHaveBeenCalledTimes(1);
    expect(batchCloseSpy).toHaveBeenCalledWith({
      payload: {
        data_export_workflow_uids: [DataExportWorkflowList[1].workflow_uid]
      },
      project_uid: mockProjectInfo.projectID
    });

    expect(screen.getByText('批量关闭').closest('button')).toHaveClass(
      'ant-btn-loading'
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(exportWorkflowListSpy).toHaveBeenCalledTimes(2);
    expect(screen.getByText('批量关闭').closest('button')).not.toHaveClass(
      'ant-btn-loading'
    );
    expect(screen.getByText('批量关闭').closest('button')).toBeDisabled();
  });

  it('render table filter items', async () => {
    const { container } = superRender(<ExportWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('待导出'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(exportWorkflowListSpy).toHaveBeenCalledTimes(2);
    expect(exportWorkflowListSpy).toHaveBeenCalledWith({
      page_index: 1,
      page_size: 20,
      fuzzy_keyword: '',
      project_uid: mockProjectInfo.projectID,
      filter_by_status:
        ListDataExportWorkflowsFilterByStatusEnum.wait_for_export
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(container).toMatchSnapshot();
  });

  it('render create data export button', () => {
    mockUseCurrentProject({ projectArchive: true });
    superRender(<ExportWorkflowList />);

    expect(screen.queryByText('创建导出')).not.toBeInTheDocument();
    cleanup();
    jest.clearAllMocks();

    mockUseCurrentProject({ projectArchive: false });

    superRender(<ExportWorkflowList />);
    expect(screen.queryByText('创建导出')).toBeInTheDocument();
  });

  it('should execute navigate function when clicked table row', async () => {
    superRender(<ExportWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText(DataExportWorkflowList[0].workflow_name!));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/project/${mockProjectInfo.projectID}/data/export/${DataExportWorkflowList[0].workflow_uid}`
    );
  });
});
