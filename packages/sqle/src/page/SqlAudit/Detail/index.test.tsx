import SqlAuditDetail from '.';
import sqlAuditRecord from '../../../testUtils/mockApi/sqlAuditRecord';
import task from '../../../testUtils/mockApi/task';
import { BrowserRouter } from 'react-router-dom';
import { act, cleanup, screen } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { ModalName } from '../../../data/ModalName';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/SqlAudit/Detail', () => {
  let mockUseCurrentProjectSpy: jest.SpyInstance;

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum['UNIQUE_KEY_REQUIRED']]);

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
    mockUseCurrentProjectSpy = mockUseCurrentProject();
  });

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const getSqlAuditRecordDetailSpy = sqlAuditRecord.getSQLAuditRecord();
    const getAuditTaskSqlSpy = task.getAuditTaskSQLs();
    const { baseElement } = renderWithThemeAndRedux(
      <BrowserRouter>
        <SqlAuditDetail />
      </BrowserRouter>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlAuditRecordDetailSpy).toHaveBeenCalledTimes(1);
    expect(getAuditTaskSqlSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should hide create button when project is archived', async () => {
    sqlAuditRecord.getSQLAuditRecord();
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
    renderWithThemeAndRedux(
      <BrowserRouter>
        <SqlAuditDetail />
      </BrowserRouter>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('创建审核')).not.toBeInTheDocument();
  });
});
