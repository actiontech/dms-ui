import SqlAuditDetail from '.';
import sqlAuditRecord from '../../../testUtils/mockApi/sqlAuditRecord';
import task from '../../../testUtils/mockApi/task';
import { BrowserRouter } from 'react-router-dom';
import { act, cleanup, screen } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('sqle/SqlAudit/Detail', () => {
  let mockUseCurrentProjectSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
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
    expect(getSqlAuditRecordDetailSpy).toBeCalledTimes(1);
    expect(getAuditTaskSqlSpy).toBeCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('should hide create button when project is archived', async () => {
    sqlAuditRecord.getSQLAuditRecord();
    mockUseCurrentProjectSpy.mockClear();
    mockUseCurrentProjectSpy.mockImplementation(() => ({
      ...mockProjectInfo,
      projectArchive: true
    }));
    renderWithThemeAndRedux(
      <BrowserRouter>
        <SqlAuditDetail />
      </BrowserRouter>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('创建审核')).not.toBeInTheDocument();
  });
});
