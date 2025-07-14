import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import dataExport from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport';
import { baseSuperRender } from '../../../../testUtils/superRender';
import ExportWorkflowList from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { useNavigate } from 'react-router-dom';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { ListDBServiceTipsFunctionalModuleEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import { ListDataExportWorkflowsFilterByStatusEnum } from '@actiontech/shared/lib/api/base/service/DataExportWorkflows/index.enum';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { DataExportWorkflowList } from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport/data';
import { SystemRole } from '@actiontech/shared/lib/enum';

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
    const { container } = baseSuperRender(<ExportWorkflowList />);

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
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      }
    });

    const { container } = baseSuperRender(<ExportWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(screen.queryByText('批量关闭')).not.toBeInTheDocument();

    jest.clearAllMocks();
    cleanup();

    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: true
      }
    });
    baseSuperRender(<ExportWorkflowList />);
    expect(screen.queryByText('批量关闭')).toBeInTheDocument();

    jest.clearAllMocks();
    cleanup();

    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      },
      bindProjects: [
        {
          is_manager: true,
          project_name: mockProjectInfo.projectName,
          project_id: mockProjectInfo.projectID,
          archived: false
        }
      ]
    });

    const batchCloseSpy = dataExport.batchCloseWorkflowAction();
    baseSuperRender(<ExportWorkflowList />);
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
    const { container } = baseSuperRender(<ExportWorkflowList />);
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
    mockUseCurrentUser({
      bindProjects: [
        {
          project_id: mockProjectInfo.projectID,
          project_name: mockProjectInfo.projectName,
          is_manager: true,
          archived: true
        }
      ]
    });
    baseSuperRender(<ExportWorkflowList />);

    expect(screen.queryByText('创建导出')).not.toBeInTheDocument();
    cleanup();
    jest.clearAllMocks();

    mockUseCurrentUser({
      bindProjects: [
        {
          project_id: mockProjectInfo.projectID,
          project_name: mockProjectInfo.projectName,
          is_manager: true,
          archived: false
        }
      ]
    });

    baseSuperRender(<ExportWorkflowList />);
    expect(screen.queryByText('创建导出')).toBeInTheDocument();
  });

  it('should execute navigate function when clicked table row', async () => {
    baseSuperRender(<ExportWorkflowList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText(DataExportWorkflowList[0].workflow_name!));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/project/${mockProjectInfo.projectID}/data/export/${DataExportWorkflowList[0].workflow_uid}`
    );
  });
});
