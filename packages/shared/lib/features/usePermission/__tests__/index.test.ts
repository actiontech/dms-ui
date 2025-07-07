import { renderHook } from '@testing-library/react-hooks';
import { useSelector } from 'react-redux';
import { mockUseCurrentUser } from '../../../testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '../../../testUtil/mockHook/mockUseCurrentProject';
import usePermission from '../usePermission';
import { PERMISSIONS } from '../permissions';
import { PERMISSION_MANIFEST } from '../permissionManifest';
import {
  OpPermissionItemOpPermissionTypeEnum,
  OpPermissionItemRangeTypeEnum
} from '../../../api/base/service/common.enum';
import { IOpPermissionItem } from '../../../api/base/service/common';
import { mockProjectInfo } from '../../../testUtil/mockHook/data';
import { SystemRole } from '../../../enum';
import { ActiontechTableActionsWithPermissions } from '../index.type';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

describe('usePermission', () => {
  const mockState = {
    permission: {
      moduleFeatureSupport: {
        sqlOptimization: true
      },
      userOperationPermissions: {
        is_admin: false,
        op_permission_list: [] as IOpPermissionItem[]
      }
    }
  };

  beforeEach(() => {
    (useSelector as jest.Mock).mockImplementation((selector) =>
      selector(mockState)
    );
    mockUseCurrentUser();
    mockUseCurrentProject();
  });

  it('should match snapshot', () => {
    expect(PERMISSIONS).toMatchSnapshot();
    expect(PERMISSION_MANIFEST).toMatchSnapshot();
    const countPermissionKeys = (obj: Record<string, any>) => {
      let count = 0;

      const traverse = (o: Record<string, any>) => {
        for (const key in o) {
          if (Object.prototype.hasOwnProperty.call(o, key)) {
            if (typeof o[key] === 'object' && o[key] !== null) {
              traverse(o[key]);
            } else if (typeof o[key] === 'string') {
              count++;
            }
          }
        }
      };

      traverse(obj);
      return count;
    };
    expect(countPermissionKeys(PERMISSIONS)).toBe(
      Object.keys(PERMISSION_MANIFEST).length
    );
  });

  it('should return correct moduleFeatureSupport and userOperationPermissions', () => {
    const { result } = renderHook(() => usePermission());

    expect(result.current.moduleFeatureSupport).toEqual(
      mockState.permission.moduleFeatureSupport
    );
    expect(result.current.userOperationPermissions).toEqual(
      mockState.permission.userOperationPermissions
    );
  });

  it('should check db service permission correctly', () => {
    const { result } = renderHook(() => usePermission());

    // Case 1: User is not admin and has no permissions
    expect(
      result.current.checkDbServicePermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan,
        'dbService1'
      )
    ).toBeFalsy();

    // Case 2: User is admin
    mockState.permission.userOperationPermissions.is_admin = true;
    expect(
      result.current.checkDbServicePermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan,
        'dbService1'
      )
    ).toBeTruthy();

    // Case 3: User has project admin permission
    mockState.permission.userOperationPermissions.is_admin = false;
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.project,
        range_uids: [mockProjectInfo.projectID, '2233'],
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.project_admin
      }
    ];
    expect(
      result.current.checkDbServicePermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan
      )
    ).toBeTruthy();

    // Case 4: User has specific db service permission
    mockState.permission.userOperationPermissions.is_admin = false;
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.db_service,
        range_uids: ['dbService1'],
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.save_audit_plan
      }
    ];
    expect(
      result.current.checkDbServicePermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan,
        'dbService1'
      )
    ).toBeTruthy();
    expect(
      result.current.checkDbServicePermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan,
        'dbService2'
      )
    ).toBeFalsy();

    // Case 5: User has some db service permission
    mockState.permission.userOperationPermissions.is_admin = false;
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.db_service,
        range_uids: ['dbService1'],
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.save_audit_plan
      }
    ];
    expect(
      result.current.checkDbServicePermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan
      )
    ).toBeTruthy();
  });

  it('should check page permission correctly', () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: true,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      }
    });
    const { result } = renderHook(() => usePermission());

    expect(
      result.current.checkPagePermission(PERMISSIONS.PAGES.BASE.USER_CENTER)
    ).toBeFalsy();

    expect(
      result.current.checkPagePermission(
        PERMISSIONS.PAGES.BASE.DATA_SOURCE_MANAGEMENT
      )
    ).toBeTruthy();

    expect(
      result.current.checkPagePermission(
        PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION
      )
    ).toBeTruthy();

    mockState.permission.moduleFeatureSupport.sqlOptimization = false;

    expect(
      result.current.checkPagePermission(
        PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION
      )
    ).toBeFalsy();

    // case 2: check page permission when project permission is not undefined
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      }
    });
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.project,
        range_uids: [mockProjectInfo.projectID, '2233'],
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.manage_member
      }
    ];
    const { result: case2Result } = renderHook(() => usePermission());

    expect(
      case2Result.current.checkPagePermission(PERMISSIONS.PAGES.BASE.DB_SERVICE)
    ).toBeFalsy();

    expect(
      case2Result.current.checkPagePermission(PERMISSIONS.PAGES.BASE.MEMBER)
    ).toBeTruthy();

    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.project,
        range_uids: [mockProjectInfo.projectID, '2233'],
        op_permission_type:
          OpPermissionItemOpPermissionTypeEnum.manage_project_data_source
      }
    ];

    expect(
      case2Result.current.checkPagePermission(PERMISSIONS.PAGES.BASE.DB_SERVICE)
    ).toBeTruthy();

    expect(
      case2Result.current.checkPagePermission(PERMISSIONS.PAGES.BASE.MEMBER)
    ).toBeFalsy();
  });

  it('should check action permission correctly', () => {
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: true,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      }
    });

    const { result, rerender } = renderHook(() => usePermission());

    // Case 1: Action requires admin role and project not archived
    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD
      )
    ).toBeTruthy();

    // Case 2: Action requires project to be archived
    mockUseCurrentUser({
      bindProjects: [
        {
          project_id: '123',
          project_name: 'test',
          is_manager: true,
          archived: true
        }
      ]
    });
    mockUseCurrentProject({
      projectID: '123'
    });
    rerender();
    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD
      )
    ).toBeFalsy();

    // Case 3: Action requires project manager permission
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      },
      bindProjects: [
        {
          project_id: '123',
          project_name: 'test',
          is_manager: true,
          archived: false
        }
      ]
    });

    mockUseCurrentProject({
      projectID: '123'
    });

    rerender();
    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD
      )
    ).toBeTruthy();

    // Case 4: Action requires db service permission
    mockState.permission.userOperationPermissions.is_admin = false;
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.db_service,
        range_uids: ['dbService1'],
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.save_audit_plan
      }
    ];

    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      }
    });

    rerender();

    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.CREATE_AUDIT_PLAN,
        { record: { uid: 'dbService1' } }
      )
    ).toBeTruthy();

    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.CREATE_AUDIT_PLAN,
        { record: { uid: 'dbService2' } }
      )
    ).toBeFalsy();

    // Case 5: Action requires db service permission - 2
    mockState.permission.userOperationPermissions.is_admin = false;
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.db_service,
        range_uids: ['dbService1'],
        op_permission_type: OpPermissionItemOpPermissionTypeEnum.create_workflow
      }
    ];

    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      }
    });

    rerender();

    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.SQLE.DATA_SOURCE_COMPARISON
          .CREATE_MODIFIED_SQL_WORKFLOW,
        { authDataSourceId: 'dbService1' }
      )
    ).toBeTruthy();

    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.SQLE.DATA_SOURCE_COMPARISON
          .CREATE_MODIFIED_SQL_WORKFLOW,
        { authDataSourceId: 'dbService2' }
      )
    ).toBeFalsy();

    // Case 6: Action requires project manager permission by target project id
    mockState.permission.userOperationPermissions.is_admin = false;
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      },
      bindProjects: [
        {
          project_id: '123',
          project_name: 'test',
          is_manager: true,
          archived: false
        }
      ]
    });

    mockUseCurrentProject({
      projectID: '1234'
    });

    rerender();
    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD
      )
    ).toBeFalsy();
    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD,
        { targetProjectID: '123' }
      )
    ).toBeTruthy();

    // Case 7: Action requires project manager permission by target project id
    mockState.permission.userOperationPermissions.is_admin = false;
    mockUseCurrentUser({
      userRoles: {
        [SystemRole.admin]: false,
        [SystemRole.certainProjectManager]: false,
        [SystemRole.systemAdministrator]: false,
        [SystemRole.projectDirector]: false,
        [SystemRole.auditAdministrator]: false
      }
    });

    rerender();
    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD,
        { targetProjectID: '123' }
      )
    ).toBeFalsy();
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.project,
        range_uids: ['123'],
        op_permission_type:
          OpPermissionItemOpPermissionTypeEnum.manage_project_data_source
      }
    ];
    expect(
      result.current.checkActionPermission(
        PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD,
        { targetProjectID: '123' }
      )
    ).toBeTruthy();
  });

  it('should parse table action permissions correctly', () => {
    const { result } = renderHook(() => usePermission());

    const mockActions = {
      buttons: [
        {
          key: 'action1',
          permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD
        },
        { key: 'action2' }
      ],
      moreButtons: [
        { key: 'more1', permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD },
        { key: 'more2' }
      ]
    };

    // Case 1: Parse buttons and moreButtons
    const parsedActions = result.current.parse2TableActionPermissions(
      mockActions as ActiontechTableActionsWithPermissions
    )!;
    if (!Array.isArray(parsedActions)) {
      expect(parsedActions.buttons).toHaveLength(2);
      expect(parsedActions.moreButtons).toHaveLength(2);
      expect(typeof parsedActions.buttons[0].permissions).toBe('function');
      expect(parsedActions.buttons[1].permissions).toBeUndefined();
    }

    // Case 2: Parse moreButtons as a function
    const mockActionsWithFunction = {
      ...mockActions,
      moreButtons: () => [
        { key: 'more1', permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD },
        { key: 'more2' }
      ]
    };
    const parsedActionsWithFunction =
      result.current.parse2TableActionPermissions(
        mockActionsWithFunction as any as ActiontechTableActionsWithPermissions
      );
    if (
      !Array.isArray(parsedActionsWithFunction) &&
      parsedActionsWithFunction
    ) {
      expect(typeof parsedActionsWithFunction.moreButtons).toBe('function');
      if (typeof parsedActionsWithFunction.moreButtons === 'function') {
        const moreButtons = parsedActionsWithFunction.moreButtons({});
        expect(moreButtons).toHaveLength(2);
        expect(typeof moreButtons[0].permissions).toBe('function');
        expect(moreButtons[1].permissions).toBeUndefined();
      }
    }

    // Case 3: Parse actions as an array
    const mockActionsArray = [
      { key: 'action1', permissions: PERMISSIONS.ACTIONS.BASE.DB_SERVICE.ADD },
      { key: 'action2' }
    ];
    const parsedActionsArray = result.current.parse2TableActionPermissions(
      mockActionsArray as ActiontechTableActionsWithPermissions
    );
    expect(parsedActionsArray).toHaveLength(2);
    if (parsedActionsArray && Array.isArray(parsedActionsArray)) {
      expect(typeof parsedActionsArray[0].permissions).toBe('function');
      expect(parsedActionsArray[1].permissions).toBeUndefined();
    }
  });

  it('should check project permission correctly', () => {
    const { result } = renderHook(() => usePermission());

    expect(result.current.checkProjectPermission()).toBeFalsy();

    expect(
      result.current.checkProjectPermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan
      )
    ).toBeFalsy();

    mockState.permission.userOperationPermissions.is_admin = true;
    expect(
      result.current.checkProjectPermission(
        OpPermissionItemOpPermissionTypeEnum.save_audit_plan
      )
    ).toBeTruthy();

    mockState.permission.userOperationPermissions.is_admin = false;
    mockState.permission.userOperationPermissions.op_permission_list = [
      {
        range_type: OpPermissionItemRangeTypeEnum.project,
        range_uids: [mockProjectInfo.projectID, '2233'],
        op_permission_type:
          OpPermissionItemOpPermissionTypeEnum.manage_project_data_source
      }
    ];
    expect(
      result.current.checkProjectPermission(
        OpPermissionItemOpPermissionTypeEnum.manage_project_data_source
      )
    ).toBeTruthy();
  });
});
