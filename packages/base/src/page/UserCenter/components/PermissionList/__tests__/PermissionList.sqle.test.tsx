import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import PermissionList from '../List';
import { act, cleanup } from '@testing-library/react';
import { UserCenterListEnum } from '../../../index.enum';
import { ListOpPermissionsServiceEnum } from '@actiontech/shared/lib/api/base/service/OpPermission/index.enum';

// Verifies the [sqle && !dms] branch: service is set to sqle when calling ListOpPermissions

describe('base/UserCenter/PermissionList - sqle mode', () => {
  let permissionListSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    permissionListSpy = userCenter.getOpPermissionsList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should call ListOpPermissions with service=sqle', async () => {
    superRender(
      <PermissionList activePage={UserCenterListEnum.operate_permission_list} />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(permissionListSpy).toHaveBeenCalledTimes(1);
    expect(permissionListSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        service: ListOpPermissionsServiceEnum.sqle
      })
    );
  });

  it('should render permission table in sqle mode', async () => {
    const { baseElement } = superRender(
      <PermissionList activePage={UserCenterListEnum.operate_permission_list} />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(permissionListSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        service: ListOpPermissionsServiceEnum.sqle
      })
    );
    expect(baseElement).toMatchSnapshot();
  });
});
