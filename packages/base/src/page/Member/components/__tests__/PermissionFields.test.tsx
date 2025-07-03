import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, act, screen } from '@testing-library/react';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import PermissionFields from '../PermissionFields';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { Form } from 'antd';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { SystemRole } from '@actiontech/shared/lib/enum';
import { mockCurrentUserReturn } from '@actiontech/shared/lib/testUtil/mockHook/data';

describe('base/Member/components/PermissionFields', () => {
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  let opPermissionListSpy: jest.SpyInstance;
  let useCurrentUserSpy: jest.SpyInstance;
  let useCurrentProjectSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseDbServiceDriver();
    jest.useFakeTimers();
    litDBServices = dbServices.ListDBServicesTips();
    listRoleSpy = userCenter.getRoleList();
    opPermissionListSpy = userCenter.getOpPermissionsList();
    useCurrentUserSpy = mockUseCurrentUser();
    useCurrentProjectSpy = mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snapshot', async () => {
    const { baseElement } = superRender(
      <Form>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(litDBServices).toHaveBeenCalledTimes(1);
    expect(listRoleSpy).toHaveBeenCalledTimes(1);
    expect(opPermissionListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('管理员设置')).toBeInTheDocument();
    expect(screen.getByText('是否为项目管理员')).toBeInTheDocument();
    expect(screen.getByText('项目管理权限')).toBeInTheDocument();
    expect(screen.getByText('项目操作权限')).toBeInTheDocument();
  });

  it('render with isProjectAdmin is false', async () => {
    jest.spyOn(Form, 'useWatch').mockReturnValue(true);
    const { baseElement } = superRender(
      <Form>
        <PermissionFields projectID={mockProjectInfo.projectID} />
      </Form>
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.queryByText('项目管理权限')).not.toBeInTheDocument();
    expect(screen.queryByText('项目操作权限')).not.toBeInTheDocument();
    expect(
      screen.getByText('项目管理员默认拥有项目下所有管理权限')
    ).toBeInTheDocument();
  });

  describe('allowSwitchProjectAdmin logic', () => {
    it('should enable project admin switch when user is admin', async () => {
      useCurrentUserSpy.mockImplementation(() => ({
        ...mockCurrentUserReturn,
        isAdmin: true,
        isProjectManager: jest.fn().mockReturnValue(false),
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.systemAdministrator]: false
        }
      }));

      const { container } = superRender(
        <Form>
          <PermissionFields projectID={mockProjectInfo.projectID} />
        </Form>
      );
      await act(async () => jest.advanceTimersByTime(3000));

      const switchElement = container.querySelector('.ant-switch');
      expect(switchElement).not.toHaveClass('ant-switch-disabled');
    });

    it('should enable project admin switch when user is project manager', async () => {
      useCurrentUserSpy.mockImplementation(() => ({
        ...mockCurrentUserReturn,
        isAdmin: false,
        isProjectManager: jest.fn().mockReturnValue(true),
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.systemAdministrator]: false
        }
      }));

      const { container } = superRender(
        <Form>
          <PermissionFields projectID={mockProjectInfo.projectID} />
        </Form>
      );
      await act(async () => jest.advanceTimersByTime(3000));

      const switchElement = container.querySelector('.ant-switch');
      expect(switchElement).not.toHaveClass('ant-switch-disabled');
    });

    it('should enable project admin switch when user has system administrator role', async () => {
      useCurrentUserSpy.mockImplementation(() => ({
        ...mockCurrentUserReturn,
        isAdmin: false,
        isProjectManager: jest.fn().mockReturnValue(false),
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.systemAdministrator]: true
        }
      }));

      const { container } = superRender(
        <Form>
          <PermissionFields projectID={mockProjectInfo.projectID} />
        </Form>
      );
      await act(async () => jest.advanceTimersByTime(3000));

      const switchElement = container.querySelector('.ant-switch');
      expect(switchElement).not.toHaveClass('ant-switch-disabled');
    });

    it('should disable project admin switch when user has no admin permissions', async () => {
      useCurrentUserSpy.mockImplementation(() => ({
        ...mockCurrentUserReturn,
        isAdmin: false,
        isProjectManager: jest.fn().mockReturnValue(false),
        userRoles: {
          ...mockCurrentUserReturn.userRoles,
          [SystemRole.systemAdministrator]: false
        }
      }));

      const { container } = superRender(
        <Form>
          <PermissionFields projectID={mockProjectInfo.projectID} />
        </Form>
      );
      await act(async () => jest.advanceTimersByTime(3000));

      const switchElement = container.querySelector('.ant-switch');
      expect(switchElement).toHaveClass('ant-switch-disabled');
    });
  });
});
