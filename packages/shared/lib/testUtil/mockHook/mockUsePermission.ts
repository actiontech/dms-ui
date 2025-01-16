import { useSelector } from 'react-redux';
import { mockCurrentUserReturn, mockProjectInfo } from './data';
import { mockUseCurrentUser } from './mockUseCurrentUser';
import { mockUseCurrentProject } from './mockUseCurrentProject';
import * as usePermissionModule from '../../features/usePermission/usePermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

const mockUsePermissionData = {
  moduleFeatureSupport: {
    sqlOptimization: false
  },
  userOperationPermissions: null,
  checkDbServicePermission: jest.fn(),
  checkPagePermission: jest.fn(),
  checkActionPermission: jest.fn(),
  parse2TableActionPermissions: jest.fn(),
  parse2TableToolbarActionPermissions: jest.fn()
};

export const mockUsePermission = (
  mockData?: Partial<typeof mockUsePermissionData>,
  options?: {
    mockUseCurrentUserData?: Partial<typeof mockCurrentUserReturn>;
    mockUseCurrentProjectData?: Partial<typeof mockProjectInfo>;
    mockCurrentUser?: boolean;
    mockCurrentProject?: boolean;
    mockSelector?: boolean; // 控制是否要mock useSelector
    useSpyOnMockHooks?: boolean;
  }
) => {
  if (options?.useSpyOnMockHooks) {
    const spy = jest.spyOn(usePermissionModule, 'default');
    spy.mockImplementation(() => ({ ...mockUsePermissionData, ...mockData }));
    return spy;
  }

  if (options?.mockCurrentUser) {
    mockUseCurrentUser(options?.mockUseCurrentUserData);
  }
  if (options?.mockCurrentProject) {
    mockUseCurrentProject(options?.mockUseCurrentProjectData);
  }

  // 防止和单元测试中已有的 mock useSelector 冲突
  if (options?.mockSelector) {
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector({
        permission: {
          moduleFeatureSupport:
            mockData?.moduleFeatureSupport ??
            mockUsePermissionData.moduleFeatureSupport,
          userOperationPermissions:
            mockData?.userOperationPermissions ??
            mockUsePermissionData.userOperationPermissions
        }
      })
    );
  }
};
