import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, act, screen } from '@testing-library/react';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';
import PermissionFields from '../PermissionFields';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { Form } from 'antd';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

describe('base/Member/components/PermissionFields', () => {
  let litDBServices: jest.SpyInstance;
  let listRoleSpy: jest.SpyInstance;
  let opPermissionListSpy: jest.SpyInstance;
  const checkActionPermissionSpy = jest.fn();

  beforeEach(() => {
    mockUseDbServiceDriver();
    jest.useFakeTimers();
    litDBServices = dbServices.ListDBServicesTips();
    listRoleSpy = userCenter.getRoleList();
    opPermissionListSpy = userCenter.getOpPermissionsList();
    mockUsePermission(
      {
        checkActionPermission: checkActionPermissionSpy
      },
      {
        useSpyOnMockHooks: true
      }
    );
    checkActionPermissionSpy.mockReturnValue(true);
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

  it('should disable project admin switch when checkActionPermission return false', async () => {
    checkActionPermissionSpy.mockReturnValue(false);

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
