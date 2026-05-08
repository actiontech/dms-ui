import { superRenderHook } from '../../../testUtil/superRender';
import useBusinessWritePermission from '../index';
import { mockUseCurrentUser } from '../../../testUtil/mockHook/mockUseCurrentUser';
import { SystemRole } from '@actiontech/dms-kit';

describe('useBusinessWritePermission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const testCases = [
    {
      name: 'should return isBusinessWriteDisabled=false when admin has BWP=true',
      mockData: {
        isAdmin: true,
        userRoles: {
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: true
      },
      expected: {
        isBusinessWriteDisabled: false,
        businessWritePermission: true
      }
    },
    {
      name: 'should return isBusinessWriteDisabled=true when admin has BWP=false',
      mockData: {
        isAdmin: true,
        userRoles: {
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: false
      },
      expected: {
        isBusinessWriteDisabled: true,
        businessWritePermission: false
      }
    },
    {
      name: 'should return isBusinessWriteDisabled=true when systemAdministrator has BWP=false',
      mockData: {
        isAdmin: false,
        userRoles: {
          [SystemRole.admin]: false,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.systemAdministrator]: true,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: false
      },
      expected: {
        isBusinessWriteDisabled: true,
        businessWritePermission: false
      }
    },
    {
      name: 'should return isBusinessWriteDisabled=false when normal user has BWP=false',
      mockData: {
        isAdmin: false,
        userRoles: {
          [SystemRole.admin]: false,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: false
      },
      expected: {
        isBusinessWriteDisabled: false,
        businessWritePermission: false
      }
    },
    {
      name: 'should return isBusinessWriteDisabled=false when systemAdministrator has BWP=true',
      mockData: {
        isAdmin: false,
        userRoles: {
          [SystemRole.admin]: false,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.systemAdministrator]: true,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: true
      },
      expected: {
        isBusinessWriteDisabled: false,
        businessWritePermission: true
      }
    }
  ];

  testCases.forEach(({ name, mockData, expected }) => {
    it(name, () => {
      mockUseCurrentUser(mockData);
      const { result } = superRenderHook(() => useBusinessWritePermission());
      expect(result.current.isBusinessWriteDisabled).toBe(
        expected.isBusinessWriteDisabled
      );
      expect(result.current.businessWritePermission).toBe(
        expected.businessWritePermission
      );
    });
  });
});
