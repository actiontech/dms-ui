import { render } from '@testing-library/react';
import { mockUsePermission } from '../../testUtil/mockHook/mockUsePermission';
import PermissionControl from '.';
import { PERMISSIONS } from '../usePermission';

describe('test PermissionControl', () => {
  it('should match snapshot with "checkActionPermission" return false', () => {
    mockUsePermission({
      checkActionPermission: jest.fn().mockReturnValue(false)
    });

    expect(
      render(
        <PermissionControl permission={PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD}>
          children
        </PermissionControl>
      ).container
    ).toMatchSnapshot();
  });

  it('should match snapshot with "checkActionPermission" return true', () => {
    mockUsePermission({
      checkActionPermission: jest.fn().mockReturnValue(true)
    });

    expect(
      render(
        <PermissionControl permission={PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD}>
          children
        </PermissionControl>
      ).container
    ).toMatchSnapshot();
  });
});
