import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import DatabaseRole from '..';
import auth from '../../../testUtil/mockApi/auth';
import { mockOracleInstanceData } from '../../../testUtil/mockApi/auth/data';
import dbRole from '../../../testUtil/mockApi/dbRole';
import { mockDBRoleData } from '../../../testUtil/mockApi/dbRole/data';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import eventEmitter from '../../../utils/EventEmitter';
import { EventEmitterKey, ModalName } from '../../../data/enum';
import RecoilObservable from '../../../testUtil/RecoilObservable';
import { DatabaseRoleModalStatus } from '../../../store/databaseRole';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('provision/DatabaseRole', () => {
  let authListServicesSpy: jest.SpyInstance;
  let authListDBRoleSpy: jest.SpyInstance;
  let authDelDBRoleSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();
  const navigateSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    authListServicesSpy = auth.listServices();
    authListDBRoleSpy = dbRole.authListDBRole();
    authDelDBRoleSpy = dbRole.authDelDBRole();
    mockUsePermission({}, { mockSelector: true });
    (useDispatch as jest.Mock).mockReturnValue(dispatchSpy);
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    mockUseCurrentUser();
    mockUseCurrentProject();
    mockUseDbServiceDriver();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('render init snap', async () => {
    const { container } = superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('render creation button', async () => {
    authListServicesSpy.mockClear();
    authListServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockOracleInstanceData[0]]
      })
    );
    const { container } = superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(1);
    expect(authListServicesSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('创建角色')).toBeVisible();
    fireEvent.click(screen.getByText('创建角色'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(1);

    cleanup();
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: false,
        [SystemRole.systemAdministrator]: false
      },
      bindProjects: [
        {
          is_manager: false,
          project_id: mockProjectInfo.projectID,
          project_name: mockProjectInfo.projectName,
          archived: false
        }
      ]
    });
    superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('创建角色')).not.toBeInTheDocument();

    cleanup();
    mockUseCurrentUser({
      userRoles: {
        ...mockCurrentUserReturn.userRoles,
        [SystemRole.admin]: true,
        [SystemRole.systemAdministrator]: true
      },
      bindProjects: [
        {
          is_manager: true,
          project_id: mockProjectInfo.projectID,
          project_name: mockProjectInfo.projectName,
          archived: true
        }
      ]
    });
    superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.queryByText('创建角色')).not.toBeInTheDocument();
  });

  it('render switch instance', async () => {
    authListServicesSpy.mockClear();
    authListServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockOracleInstanceData
      })
    );
    superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(1);
    fireEvent.mouseDown(getBySelector('.ant-select-selection-search-input'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('mysql-1 (10.186.62.3:33062)'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(2);
  });

  it('render emit listening event', async () => {
    superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(1);

    await act(async () => {
      eventEmitter.emit(EventEmitterKey.Refresh_Database_Role_List_Table);
      await jest.advanceTimersByTime(3000);
    });
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(2);
  });

  it('render edit role', async () => {
    authListDBRoleSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockDBRoleData[0]]
      })
    );
    superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledTimes(1);
  });

  it('render delete role', async () => {
    authListDBRoleSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: [mockDBRoleData[0]]
      })
    );
    authListServicesSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockOracleInstanceData
      })
    );
    superRender(<DatabaseRole />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('删 除'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('是否删除当前角色？')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(authDelDBRoleSpy).toHaveBeenCalledTimes(1);
    expect(authDelDBRoleSpy).toHaveBeenNthCalledWith(1, {
      project_uid: mockProjectInfo.projectID,
      db_role_uid: mockDBRoleData[0]?.db_role?.uid,
      db_service_uid: mockOracleInstanceData[0]?.uid
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('角色权限删除成功！')).toBeInTheDocument();
  });

  it('render click role name', async () => {
    const modalStatusChangeSpy = jest.fn();
    superRender(
      <>
        <DatabaseRole />
        <RecoilObservable
          state={DatabaseRoleModalStatus}
          onChange={modalStatusChangeSpy}
        />
      </>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(authListDBRoleSpy).toHaveBeenCalledTimes(1);
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(1);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(1, {
      [ModalName.DatabaseRoleDetailModal]: false
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('role1'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(modalStatusChangeSpy).toHaveBeenCalledTimes(2);
    expect(modalStatusChangeSpy).toHaveBeenNthCalledWith(2, {
      [ModalName.DatabaseRoleDetailModal]: true
    });
  });
});
