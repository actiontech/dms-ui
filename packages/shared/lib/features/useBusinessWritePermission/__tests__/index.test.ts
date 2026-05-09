import { superRenderHook } from '../../../testUtil/superRender';
import useBusinessWritePermission from '../index';
import { mockUseCurrentUser } from '../../../testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '../../../testUtil/mockHook/mockUseCurrentProject';
import { SystemRole } from '@actiontech/dms-kit';

const PROJECT_ID = 'proj-001';

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
      name: 'should return isBusinessWriteDisabled=true when admin has BWP=false (no project context)',
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
      name: 'should return isBusinessWriteDisabled=true when systemAdministrator has BWP=false (no project context)',
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

  describe('project-level permission overrides BWP=off', () => {
    it('should return isBusinessWriteDisabled=false when admin has BWP=false but is project manager in current project', () => {
      mockUseCurrentUser({
        isAdmin: true,
        userRoles: {
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: true,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: false,
        bindProjects: [
          {
            project_id: PROJECT_ID,
            project_name: 'proj',
            is_manager: true,
            archived: false
          }
        ]
      });
      mockUseCurrentProject({ projectID: PROJECT_ID, projectName: 'proj' });

      const { result } = superRenderHook(() => useBusinessWritePermission());
      expect(result.current.isBusinessWriteDisabled).toBe(false);
      expect(result.current.businessWritePermission).toBe(false);
    });

    it('should return isBusinessWriteDisabled=true when admin has BWP=false and is NOT project manager in current project', () => {
      mockUseCurrentUser({
        isAdmin: true,
        userRoles: {
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: false,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: false,
        bindProjects: [
          {
            project_id: PROJECT_ID,
            project_name: 'proj',
            is_manager: false,
            archived: false
          }
        ]
      });
      mockUseCurrentProject({ projectID: PROJECT_ID, projectName: 'proj' });

      const { result } = superRenderHook(() => useBusinessWritePermission());
      expect(result.current.isBusinessWriteDisabled).toBe(true);
      expect(result.current.businessWritePermission).toBe(false);
    });

    it('should return isBusinessWriteDisabled=false when sysAdmin has BWP=false but is project manager in current project', () => {
      mockUseCurrentUser({
        isAdmin: false,
        userRoles: {
          [SystemRole.admin]: false,
          [SystemRole.certainProjectManager]: true,
          [SystemRole.systemAdministrator]: true,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: false,
        bindProjects: [
          {
            project_id: PROJECT_ID,
            project_name: 'proj',
            is_manager: true,
            archived: false
          }
        ]
      });
      mockUseCurrentProject({ projectID: PROJECT_ID, projectName: 'proj' });

      const { result } = superRenderHook(() => useBusinessWritePermission());
      expect(result.current.isBusinessWriteDisabled).toBe(false);
      expect(result.current.businessWritePermission).toBe(false);
    });

    it('should return isBusinessWriteDisabled=true when in project context with is_manager=true but BWP=true (normal flow)', () => {
      mockUseCurrentUser({
        isAdmin: true,
        userRoles: {
          [SystemRole.admin]: true,
          [SystemRole.certainProjectManager]: true,
          [SystemRole.systemAdministrator]: false,
          [SystemRole.auditAdministrator]: false
        },
        businessWritePermission: true,
        bindProjects: [
          {
            project_id: PROJECT_ID,
            project_name: 'proj',
            is_manager: true,
            archived: false
          }
        ]
      });
      mockUseCurrentProject({ projectID: PROJECT_ID, projectName: 'proj' });

      const { result } = superRenderHook(() => useBusinessWritePermission());
      expect(result.current.isBusinessWriteDisabled).toBe(false);
      expect(result.current.businessWritePermission).toBe(true);
    });
  });
});
