import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import VersionManagementList from '..';
import sqlVersion from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version';
import { getSqlVersionListV1MockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sql_version/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { useNavigate } from 'react-router-dom';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('sqle/VersionManagement/List', () => {
  let getSqlVersionListSpy: jest.SpyInstance;
  let lockSqlVersionV1: jest.SpyInstance;
  let deleteSqlVersionV1: jest.SpyInstance;
  const navigateSpy = jest.fn();
  const checkActionPermissionSpy = jest.fn();
  const firstMockVersion = getSqlVersionListV1MockData.data?.[0];

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockUseCurrentUser();
    getSqlVersionListSpy = sqlVersion.mockGetSqlVersionListV1();
    lockSqlVersionV1 = sqlVersion.mockLockSqlVersionV1();
    deleteSqlVersionV1 = sqlVersion.mockDeleteSqlVersionV1();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUsePermission(
      { checkActionPermission: checkActionPermissionSpy },
      { useSpyOnMockHooks: true }
    );
    checkActionPermissionSpy.mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { baseElement } = sqleSuperRender(<VersionManagementList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加版本')).toBeInTheDocument();
  });

  it('hide action button when current user is not admin or project manager', async () => {
    checkActionPermissionSpy.mockReturnValue(false);
    sqleSuperRender(<VersionManagementList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('添加版本')).not.toBeInTheDocument();
    expect(screen.queryByText('删 除')).not.toBeInTheDocument();
    expect(screen.queryByText('锁 定')).not.toBeInTheDocument();
    expect(screen.queryByText('编 辑')).not.toBeInTheDocument();
  });

  it('render filter item', async () => {
    const { baseElement } = sqleSuperRender(<VersionManagementList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('筛选'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(getAllBySelector('.basic-range-picker-wrapper')).toHaveLength(2);
    expect(baseElement).toMatchSnapshot();
  });

  it('render edit version', async () => {
    getSqlVersionListSpy.mockClear();
    getSqlVersionListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [firstMockVersion]
      })
    );
    sqleSuperRender(<VersionManagementList />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect(navigateSpy).toHaveBeenCalledWith(
      `/sqle/project/${mockProjectInfo.projectID}/version-management/update/${firstMockVersion?.version_id}`
    );
  });

  it('render delete version', async () => {
    getSqlVersionListSpy.mockClear();
    getSqlVersionListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [firstMockVersion]
      })
    );
    sqleSuperRender(<VersionManagementList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText(
        '删除版本记录后，将去除工单上的版本标签，确定删除改版本吗？'
      )
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(deleteSqlVersionV1).toHaveBeenCalledTimes(1);
    expect(deleteSqlVersionV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: `${firstMockVersion?.version_id}`
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(2);
  });

  it('render lock version', async () => {
    getSqlVersionListSpy.mockClear();
    getSqlVersionListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [firstMockVersion]
      })
    );
    sqleSuperRender(<VersionManagementList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('锁 定'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('锁定后无法再修改版本中的变更内容，确认锁定该版本吗？')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(lockSqlVersionV1).toHaveBeenCalledTimes(1);
    expect(lockSqlVersionV1).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      sql_version_id: `${firstMockVersion?.version_id}`
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSqlVersionListSpy).toHaveBeenCalledTimes(2);
  });
});
